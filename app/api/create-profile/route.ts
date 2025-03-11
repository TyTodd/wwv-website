const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const APPLICANTS_TABLE_ID = process.env.APPLICANTS_TABLE_ID;
const STARTUPS_TABLE_ID = process.env.STARTUPS_TABLE_ID;
const USER_TYPES_TABLE_ID = process.env.USER_TYPES_TABLE_ID;

export async function POST(request: Request) {
  try {
    const fieldIds = await import("../fieldIds.json");
    console.log("fieldIds", fieldIds);
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "university",
      "linkedin_url",
      "opportunity_interests",
      "position_interests",
      "area_interests",
      "work_authorization",
      "visa_sponsorship",
      "user_id",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return new Response(
          JSON.stringify({
            error: `Missing required field: ${field}`,
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    const userExists = await checkUserExists(data.user_id);
    console.log("userExists", userExists);
    if (userExists) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    // TODO: Add profile to database
    // Make request to Airtable API
    const createUserResponse = await createUser(data);
    if (!createUserResponse.ok) {
      const errorData = await createUserResponse.json();
      console.log("errorData", errorData);
      return new Response(
        JSON.stringify({
          error: `Failed to create profile in Airtable: ${errorData.error?.message || "Unknown error"}`,
        }),
        {
          status: createUserResponse.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = await createUserResponse.json();

    return new Response(
      JSON.stringify({
        message: "Profile created successfully",
        id: result.records[0].id,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error creating profile:", error);

    return new Response(
      JSON.stringify({
        error:
          error.message ||
          "An unexpected error occurred while creating the profile",
      }),
      {
        status: error.status || 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

async function checkUserExists(userId: string) {
  console.log("userId", userId);
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.APPLICANTS_TABLE_ID}?fields%5B%5D=User+ID&filterByFormula=%7BUser+ID%7D+%3D+%22${userId}%22`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();
  console.log("result", result);
  return result.records.length > 0;
}

async function createUser(data: any) {
  const fieldIds = await import("../fieldIds.json");
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.APPLICANTS_TABLE_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              [fieldIds["First Name"]]: data.first_name,
              [fieldIds["Last Name"]]: data.last_name,
              [fieldIds["Email"]]: data.email,
              [fieldIds["University"]]: data.university,
              [fieldIds["LinkedIn URL"]]: data.linkedin_url,
              [fieldIds["Opportunity Interests"]]: data.opportunity_interests,
              [fieldIds["Position Interests"]]: data.position_interests,
              [fieldIds["Area Interests"]]: data.area_interests,
              [fieldIds["Skills, Interests, Background"]]: data.background,
              [fieldIds["Other Links"]]: data.links,
              [fieldIds["Work Authorization"]]: data.work_authorization,
              [fieldIds["Visa Sponsorship"]]: data.visa_sponsorship,
              [fieldIds["User ID"]]: data.user_id,
            },
          },
        ],
      }),
    }
  );

  return response;
}
