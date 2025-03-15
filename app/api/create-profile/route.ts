import { uploadFile, uploadFileToAirtable } from "../api-utils";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const APPLICANTS_TABLE_ID = process.env.APPLICANTS_TABLE_ID;
const STARTUPS_TABLE_ID = process.env.STARTUPS_TABLE_ID;
const USER_TYPES_TABLE_ID = process.env.USER_TYPES_TABLE_ID;

export async function POST(request: Request) {
  try {
    const fieldIds = await import("../fieldIds.json");
    const data = await request.formData();

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
      if (!data.get(field)) {
        console.error("Missing required field", field);
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

    const userExists = await checkUserExists(data.get("user_id") as string);
    console.error("user already exists", userExists);
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
      console.error("Failed to create profile", errorData);
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

    const profileId = result.records[0].id;
    const resumeResponse = await uploadFileToAirtable(
      data.get("resume") as File,
      profileId,
      fieldIds["Resume"]
    );

    if (!resumeResponse.ok) {
      console.error("Failed to upload resume", resumeResponse);
      return new Response(
        JSON.stringify({ error: "Failed to upload resume" }),
        {
          status: 400,
        }
      );
    }

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
  return result.records.length > 0;
}

async function createUser(data: any) {
  const fieldIds = await import("../fieldIds.json");
  const fields = {
    [fieldIds["First Name"]]: data.get("first_name"),
    [fieldIds["Last Name"]]: data.get("last_name"),
    [fieldIds["Email"]]: data.get("email"),
    [fieldIds["University"]]: data.get("university"),
    [fieldIds["LinkedIn URL"]]: data.get("linkedin_url"),
    [fieldIds["Opportunity Interests"]]: JSON.parse(
      data.get("opportunity_interests") as string
    ),
    [fieldIds["Position Interests"]]: JSON.parse(
      data.get("position_interests") as string
    ),
    [fieldIds["Area Interests"]]: JSON.parse(
      data.get("area_interests") as string
    ),
    [fieldIds["Skills, Interests, Background"]]: data.get("background"),
    [fieldIds["Other Links"]]: data.get("links"),
    [fieldIds["Work Authorization"]]:
      (data.get("work_authorization") as string) === "true",
    [fieldIds["Visa Sponsorship"]]:
      (data.get("visa_sponsorship") as string) === "true",
    [fieldIds["User ID"]]: data.get("user_id"),
  };
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
            fields: fields,
          },
        ],
      }),
    }
  );

  return response;
}
