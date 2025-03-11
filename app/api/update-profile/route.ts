const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const APPLICANTS_TABLE_ID = process.env.APPLICANTS_TABLE_ID;
const STARTUPS_TABLE_ID = process.env.STARTUPS_TABLE_ID;
const USER_TYPES_TABLE_ID = process.env.USER_TYPES_TABLE_ID;

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const user_id = data.user_id;

    const fieldIds = await import("../fieldIds.json");
    const recordId = await getRecordId(user_id);
    if (!recordId) {
      return new Response(JSON.stringify({ error: "User does not exist" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await updateUserProfile(recordId, data);
    const result = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error getting profile:", error);

    return new Response(
      JSON.stringify({
        error:
          error.message ||
          "An unexpected error occurred while getting the profile",
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

async function getRecordId(userId: string) {
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.APPLICANTS_TABLE_ID}?filterByFormula=%7BUser+ID%7D+%3D+%22${userId}%22`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  const result = await response.json();
  console.log(result);
  if (result.records.length === 0) {
    return null;
  }
  return result.records[0].id;
}

async function updateUserProfile(recordId: string, data: any) {
  const fieldIds = await import("../fieldIds.json");
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.APPLICANTS_TABLE_ID}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
        },
      }),
    }
  );

  return response;
}
