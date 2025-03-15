"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import UploadForm from "./file-uploader";
import { useGlobalStore } from "@/store/globalStore";

// Define an interface for the form data
interface InfoData {
  theme: string;
  setTheme: (theme: string) => void;
}

interface FileData {
  name: string;
  size: number;
  type: string;
  data: string; // Base64 or Blob URL representation
}

interface FormValuesType {
  [key: string]: string | string[] | boolean | undefined;
  first_name?: string;
  last_name?: string;
  email?: string;
  university?: string;
  linkedin_url?: string;
  background?: string;
  links?: string;
  work_authorization?: boolean;
  visa_sponsorship?: boolean;
  opportunity_interests?: string[];
  position_interests?: string[];
  area_interests?: string[];
}

export default function Info() {
  const [userType, setUserType] = useState("student");
  const { user, isLoaded } = useUser();
  const [formValues, setformValues] = useState<FormValuesType>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });
  const [saved, setSaved] = useState(true);
  const [profileFetched, setProfileFetched] = useState(false);
  const { globalStore, setGlobalStore, resetGlobalStore } = useGlobalStore();
  const [fileName, setFileName] = useState<string | null>(
    globalStore.resume?.name || null
  );

  useEffect(() => {
    if (!profileFetched && isLoaded && user) {
      loadProfile().then(() => setProfileFetched(true));
    }
  }, [profileFetched, isLoaded, user]);

  const loadProfile = async () => {
    const response = await fetch(`/api/get-profile?user_id=${user?.id}`, {
      method: "GET",
    });
    const data = await response.json();
    // const { last_updated, resume, ...filteredGlobalStore } = globalStore;
    if (
      globalStore.last_updated &&
      new Date(globalStore.last_updated) > new Date(data.last_updated) &&
      globalStore.saved !== undefined
    ) {
      console.log("using globalStore");
      setformValues({
        first_name: globalStore.first_name,
        last_name: globalStore.last_name,
        email: globalStore.email,
        university: globalStore.university,
        linkedin_url: globalStore.linkedin_url,
        work_authorization: globalStore.work_authorization,
        visa_sponsorship: globalStore.visa_sponsorship,
        opportunity_interests: globalStore.opportunity_interests,
        position_interests: globalStore.position_interests,
        area_interests: globalStore.area_interests,
        background: globalStore.background,
        links: globalStore.links,
      });
      setFileName(globalStore.resumeName || null);
      setSaved(globalStore.saved);
    } else {
      console.log("using backend");
      const { last_updated, resumeName, ...filteredData } = data;
      setformValues(filteredData);
      console.log("resumeName", resumeName);
      setFileName(resumeName || null);
      setGlobalStore({
        ...filteredData,
        resumeName: resumeName,
        saved: true,
        resume: null,
      });
      console.log("globalStore", globalStore);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange");
    const file = e.target.files?.[0]; // Get the first selected file
    if (file) {
      console.log("setting globalStore");
      setGlobalStore({
        ...globalStore,
        resume: file,
        resumeName: file.name,
        saved: false,
      });
      setFileName(file.name); // Update local state for display
      setSaved(false);
      console.log("globalStore", globalStore);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setSaved(false);
    const { id, value, type, checked } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      // For checkboxes, we need to handle multiple selections
      setformValues((prev) => {
        const fieldName = e.target.name;
        const prevValues = (prev[fieldName] as string[]) || [];

        if (checked) {
          return { ...prev, [fieldName]: [...prevValues, value] };
        } else {
          return {
            ...prev,
            [fieldName]: prevValues.filter((item) => item !== value),
          };
        }
      });

      let newGlobalStore;
      const fieldName = e.target.name;
      const prevValues = (globalStore[fieldName] as string[]) || [];
      if (checked) {
        newGlobalStore = {
          ...globalStore,
          [fieldName]: [...prevValues, value],
        };
      } else {
        newGlobalStore = {
          ...globalStore,
          [fieldName]: prevValues.filter((item) => item !== value),
        };
      }
      setGlobalStore({ ...newGlobalStore, saved: false });
      console.log("globalStore", globalStore);
    } else if (id === "work_authorization" || id === "visa_sponsorship") {
      // Convert "yes"/"no" string to boolean
      setformValues((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [id]: value === "yes",
        };
      });
      setGlobalStore({ ...globalStore, [id]: value === "yes", saved: false });
      console.log("globalStore", globalStore);
    } else {
      setformValues((prev) => {
        return {
          ...prev,
          [id]: value,
        };
      });
      setGlobalStore({ ...globalStore, [id]: value, saved: false });
      console.log("globalStore", globalStore);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: "" });

    try {
      // Combine user data with form data
      const formData = new FormData();
      if (!user) {
        console.error("user is undefined");
        return;
      }
      formData.append(
        "email",
        user.primaryEmailAddress?.emailAddress || formValues?.email || ""
      );
      formData.append("user_id", user.id);

      Object.keys(formValues).forEach((key) => {
        const value = formValues[key];
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (key == "visa_sponsorship" || key == "work_authorization") {
            const boolValue = value === true ? "true" : "false";
            formData.append(key, boolValue);
          } else {
            formData.append(key, value as string);
          }
        }
      });

      if (globalStore.resume) {
        formData.append("resume", globalStore.resume);
      } else {
        formData.append("resume", "");
      }

      // Print form data entries for debugging
      console.log("form data", Array.from(formData.entries()));
      const response = await fetch("/api/update-profile", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Profile saved!",
        });
        setGlobalStore({ ...globalStore, saved: true });
        console.log("globalStore", globalStore);
        setSaved(true);
        // Optionally redirect or clear form
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          success: false,
          message:
            errorData.message ||
            "Failed to save profile. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!profileFetched) {
    return <div>Loading profile...</div>;
  }
  return (
    <>
      <div className="">
        <div className="mb-10">
          <h1 className="cl-header cl-headerTitle font-bold">Your Info</h1>
          <hr className="border-t border-gray-200 my-4" />
        </div>
        {/* Status message */}
        {submitStatus.message && (
          <div
            className={`p-4 mb-4 rounded-md ${submitStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {submitStatus.message}
          </div>
        )}
        {/* Form */}
        <form className="cl-profileSection" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Conditional rendering based on userType */}
            {userType === "student" && (
              // Student Form Section
              <div>
                <div className="flex flex-row">
                  <div className="mr-10">
                    <label
                      className="mb-1 block  font-medium text-gray-700"
                      htmlFor="first_name"
                    >
                      First Name
                    </label>
                    <input
                      id="first_name"
                      className="form-input py-2"
                      type="text"
                      placeholder="Daniela"
                      required
                      value={formValues?.first_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="">
                    <label
                      className="mb-1 block font-medium text-gray-700"
                      htmlFor="last_name"
                    >
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      className="form-input py-2"
                      type="text"
                      placeholder="Andrade"
                      value={formValues?.last_name || ""}
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    className="form-input py-2"
                    type="email"
                    placeholder="corybarker@email.com"
                    value={formValues?.email || ""}
                    readOnly={true}
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor="university"
                  >
                    University
                  </label>
                  <input
                    id="university"
                    className="form-input py-2"
                    type="text"
                    autoComplete="on"
                    placeholder=""
                    value={formValues?.university || ""}
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor="linkedin_url"
                  >
                    LinkedIn URL
                  </label>
                  <input
                    id="linkedin_url"
                    className="form-input py-2"
                    type="url"
                    autoComplete="on"
                    placeholder=""
                    value={formValues?.linkedin_url || ""}
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor=""
                  >
                    What opportunities are you interested in?
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        id="Ad-hoc projects"
                        name="opportunity_interests"
                        type="checkbox"
                        value="Ad-hoc projects"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.opportunity_interests?.includes(
                            "Ad-hoc projects"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Ad-hoc projects" className="">
                        Ad-hoc projects
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Term-time internships"
                        name="opportunity_interests"
                        type="checkbox"
                        value="Term-time internships"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.opportunity_interests?.includes(
                            "Term-time internships"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Term-time internships" className="">
                        Term-time internships
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Summer internships"
                        name="opportunity_interests"
                        type="checkbox"
                        value="Summer internships"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.opportunity_interests?.includes(
                            "Summer internships"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Summer internships" className="">
                        Summer internships
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Full-time employment"
                        name="opportunity_interests"
                        type="checkbox"
                        value="Full-time employment"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.opportunity_interests?.includes(
                            "Full-time employment"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Full-time employment" className="">
                        Full-time employment
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor="position_interests"
                  >
                    What positions align with your interests?
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        id="Software Development"
                        name="position_interests"
                        type="checkbox"
                        value="Software Development"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.position_interests?.includes(
                            "Software Development"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Software Development" className="">
                        Software Development
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Design (UI/UX, product design, etc.)"
                        name="position_interests"
                        type="checkbox"
                        value="Design (UI/UX, product design, etc.)"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.position_interests?.includes(
                            "Design (UI/UX, product design, etc.)"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="Design (UI/UX, product design, etc.)"
                        className=""
                      >
                        Design (UI/UX, product design, etc.)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Marketing & Growth"
                        name="position_interests"
                        type="checkbox"
                        value="Marketing & Growth"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.position_interests?.includes(
                            "Marketing & Growth"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Marketing & Growth" className="">
                        Marketing & Growth
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Finance / Operations"
                        name="position_interests"
                        type="checkbox"
                        value="Finance / Operations"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.position_interests?.includes(
                            "Finance / Operations"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Finance / Operations" className="">
                        Finance / Operations
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        id="Product Management"
                        name="position_interests"
                        type="checkbox"
                        value="Product Management"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.position_interests?.includes(
                            "Product Management"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Product Management" className="">
                        Product Management
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Content, Social Media, and Communications"
                        name="position_interests"
                        type="checkbox"
                        value="Content, Social Media, and Communications"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.position_interests?.includes(
                            "Content, Social Media, and Communications"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="Content, Social Media, and Communications"
                        className=""
                      >
                        Content, Social Media, and Communications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Data_Science_Analytics"
                        name="position_interests"
                        type="checkbox"
                        value="Data Science & Analytics"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.position_interests?.includes(
                            "Data Science & Analytics"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Data_Science_Analytics" className="">
                        Data Science & Analytics
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor=""
                  >
                    What areas interest you?
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        id="AI_Machine_Learning"
                        name="area_interests"
                        type="checkbox"
                        value="AI & Machine Learning"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.area_interests?.includes(
                            "AI & Machine Learning"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="AI_Machine_Learning" className="">
                        AI & Machine Learning
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Healthcare_Biotechnology"
                        name="area_interests"
                        type="checkbox"
                        value="Healthcare & Biotechnology"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.area_interests?.includes(
                            "Healthcare & Biotechnology"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Healthcare_Biotechnology" className="">
                        Healthcare & Biotechnology
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="FinTech"
                        name="area_interests"
                        type="checkbox"
                        value="FinTech"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.area_interests?.includes("FinTech") ||
                          false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="FinTech" className="">
                        FinTech
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="IT_Cybersecurity"
                        name="area_interests"
                        type="checkbox"
                        value="IT & Cybersecurity"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.area_interests?.includes(
                            "IT & Cybersecurity"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="IT_Cybersecurity" className="">
                        IT & Cybersecurity
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        id="Energy_Climate_Sustainability"
                        name="area_interests"
                        type="checkbox"
                        value="Energy, Climate, and Sustainability"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.area_interests?.includes(
                            "Energy, Climate, and Sustainability"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="Energy_Climate_Sustainability"
                        className=""
                      >
                        Energy, Climate, and Sustainability
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Education"
                        name="area_interests"
                        type="checkbox"
                        value="Education"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={formValues?.area_interests?.includes(
                          "Education"
                        )}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Education" className="">
                        Education
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Consumer_Wellness"
                        name="area_interests"
                        type="checkbox"
                        value="Consumer & Wellness"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.area_interests?.includes(
                            "Consumer & Wellness"
                          ) || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Consumer_Wellness" className="">
                        Consumer & Wellness
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="Legal"
                        name="area_interests"
                        type="checkbox"
                        value="Legal"
                        className="form-checkbox mr-2 h-5 w-5"
                        checked={
                          formValues?.area_interests?.includes("Legal") || false
                        }
                        onChange={handleInputChange}
                      />
                      <label htmlFor="Legal" className="">
                        Legal
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-3/4">
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor="background"
                  >
                    Share more about your skills, interests, and background
                    (Optional)
                  </label>
                  <div className="">
                    <textarea
                      id="background"
                      className="form-textarea py-2 h-32 w-full"
                      placeholder="Tell us more about yourself..."
                      value={formValues?.background || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {/* <div className="mt-4 w-3/4">
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor="resume"
                  >
                    Upload Your Resume
                  </label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf, .doc, .docx"
                    className="form-input py-2"
                  />
                </div> */}
                <div className="mt-4 w-3/4">
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor="links"
                  >
                    Other Relevant Links (GitHub, portfolio, personal website,
                    Medium, etc)
                  </label>
                  <input
                    id="links"
                    name="links"
                    type="text"
                    className="form-input w-full py-2"
                    placeholder="Enter other relevant links..."
                    value={formValues?.links || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-4 w-3/4">
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor="resume"
                  >
                    Upload New Resume
                  </label>
                  {fileName && (
                    <div className="mt-2 text-gray-600">
                      Current Resume: {fileName}
                    </div>
                  )}
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf"
                    className="form-input py-2"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="mt-4 w-2/4">
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor="work_authorization"
                  >
                    Are you legally authorized to work in the United States?
                    (required)
                  </label>
                  <select
                    id="work_authorization"
                    name="work_authorization"
                    className="form-select py-2 w-full"
                    required
                    value={formValues?.work_authorization ? "yes" : "no"}
                    onChange={handleInputChange}
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="mt-4 w-2/4">
                  <label
                    className="mb-1 block  font-medium text-gray-700"
                    htmlFor="visa_sponsorship"
                  >
                    Will you now or in the future require sponsorship for
                    employment visa status (e.g., H-1B visa)? (required)
                  </label>
                  <select
                    id="visa_sponsorship"
                    name="visa_sponsorship"
                    className="form-select py-2 w-full"
                    value={formValues?.visa_sponsorship ? "yes" : "no"}
                    required
                    onChange={handleInputChange}
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            )}

            {userType === "startup" && (
              // Startup Form Section
              <div className="p-4 border border-gray-300 rounded-md">
                <p className=" text-gray-700">
                  Please refer to the startups page for more information.
                </p>
              </div>
            )}
          </div>

          {userType && (
            <div className="mt-6 w-40 mb-10">
              <button
                type="submit"
                className={`btn w-full ${
                  isSubmitting || saved
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] hover:bg-[length:100%_150%]"
                } text-white shadow`}
                disabled={isSubmitting || saved}
              >
                {isSubmitting ? "Saving..." : saved ? "Saved" : "Save"}
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
