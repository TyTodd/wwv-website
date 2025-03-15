const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const APPLICANTS_TABLE_ID = process.env.APPLICANTS_TABLE_ID;
const STARTUPS_TABLE_ID = process.env.STARTUPS_TABLE_ID;
const USER_TYPES_TABLE_ID = process.env.USER_TYPES_TABLE_ID;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id parameter is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const fieldIds = await import("../fieldIds.json");
    const result = await getUserProfile(user_id);

    const fields = result.records[0].fields;
    const resumeField = fields[fieldIds["Resume"]];
    const currentResume =
      resumeField.length > 0 ? resumeField[resumeField.length - 1] : null;
    console.log("currentResume", currentResume);

    const profile = {
      first_name: fields[fieldIds["First Name"]],
      last_name: fields[fieldIds["Last Name"]],
      email: fields[fieldIds["Email"]],
      university: fields[fieldIds["University"]],
      linkedin_url: fields[fieldIds["LinkedIn URL"]],
      opportunity_interests: fields[fieldIds["Opportunity Interests"]],
      position_interests: fields[fieldIds["Position Interests"]],
      area_interests: fields[fieldIds["Area Interests"]],
      background: fields[fieldIds["Skills, Interests, Background"]],
      visa_sponsorship: fields[fieldIds["Visa Sponsorship"]],
      work_authorization: fields[fieldIds["Work Authorization"]],
      links: fields[fieldIds["Other Links"]],
      last_updated: fields[fieldIds["Last Updated"]],
      resumeName: currentResume?.filename,
    };
    return new Response(JSON.stringify(profile), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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

async function getUserProfile(userId: string) {
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.APPLICANTS_TABLE_ID}?returnFieldsByFieldId=true&filterByFormula=%7BUser+ID%7D+%3D+%22${userId}%22`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();
  return result;
}
