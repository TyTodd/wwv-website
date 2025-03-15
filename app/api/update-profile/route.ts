import { uploadFile, uploadFileToAirtable } from "../api-utils";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const APPLICANTS_TABLE_ID = process.env.APPLICANTS_TABLE_ID;
const STARTUPS_TABLE_ID = process.env.STARTUPS_TABLE_ID;
const USER_TYPES_TABLE_ID = process.env.USER_TYPES_TABLE_ID;

export async function PUT(request: Request) {
  try {
    const data = await request.formData();
    const user_id = data.get("user_id");

    const fieldIds = await import("../fieldIds.json");
    const recordId = await getRecordId(user_id as string);
    if (!recordId) {
      return new Response(JSON.stringify({ error: "User does not exist" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // let resumeUrl;
    // let resumeName;
    // if (data.get("resume")) {
    //   resumeUrl = await uploadFile(data.get("resume") as File);
    //   if (!resumeUrl) {
    //     console.error("Failed to upload resume");
    //     return new Response(
    //       JSON.stringify({ error: "Failed to upload resume" }),
    //       {
    //         status: 500,
    //         headers: { "Content-Type": "application/json" },
    //       }
    //     );
    //   }
    //   resumeName = (data.get("resume") as File).name || "";
    // }
    // console.log("upload to uguu success, URL:", resumeUrl);
    let uploadResponse;
    if (data.get("resume") && data.get("resume") !== "") {
      uploadResponse = await uploadFileToAirtable(
        data.get("resume") as File,
        recordId,
        fieldIds["Resume"]
      );
    }

    const response = await updateUserProfile(
      recordId,
      data,
      undefined,
      undefined
    );

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
    console.error("Error updating profile:", error);

    return new Response(
      JSON.stringify({
        error:
          error.message ||
          "An unexpected error occurred while updating the profile",
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
  if (result.records.length === 0) {
    return null;
  }
  return result.records[0].id;
}

async function updateUserProfile(
  recordId: string,
  data: any,
  resumeUrl: string | undefined,
  resumeName: string | undefined
) {
  const fieldIds = await import("../fieldIds.json");

  // Create the fields object without the resume field
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

  // Only add resume field if resumeUrl is provided
  //   if (resumeUrl) {
  //     fields[fieldIds["Resume"]] = {
  //       url: resumeUrl,
  //       name: resumeName,
  //     };
  //   }
  console.log("update user profile fields", fields);

  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.APPLICANTS_TABLE_ID}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    }
  );

  return response;
}
