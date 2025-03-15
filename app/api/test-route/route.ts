const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const APPLICANTS_TABLE_ID = process.env.APPLICANTS_TABLE_ID;
const STARTUPS_TABLE_ID = process.env.STARTUPS_TABLE_ID;
const USER_TYPES_TABLE_ID = process.env.USER_TYPES_TABLE_ID;

export async function POST(request: Request) {
  try {
    const fieldIds = await import("../fieldIds.json");

    // TODO: Add profile to database
    // Make request to Airtable API
    const createUserResponse = await createUser();
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

async function createUser() {
  const fieldIds = await import("../fieldIds.json");
  const testResume = await import("../testResume.json");
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
              [fieldIds["First Name"]]: "John",
              [fieldIds["Last Name"]]: "Doe",
              [fieldIds["Email"]]: "john.doe@example.com",
              [fieldIds["University"]]: "University of Example",
              [fieldIds["LinkedIn URL"]]:
                "https://www.linkedin.com/in/john-doe",
              [fieldIds["Opportunity Interests"]]: [],
              [fieldIds["Position Interests"]]: [],
              [fieldIds["Area Interests"]]: [],
              [fieldIds["Skills, Interests, Background"]]:
                "Software Development",
              [fieldIds["Other Links"]]: "https://www.example.com",
              [fieldIds["Work Authorization"]]: true,
              [fieldIds["Visa Sponsorship"]]: true,
              [fieldIds["User ID"]]: "1234567890",
              [fieldIds["Resume"]]: testResume["resume"],
            },
          },
        ],
      }),
    }
  );

  return response;
}
