export interface PincodeInfo {
  pincode: string;
  state: string;
  district: string;
  city: string;
  postOffices: string[];
  status: "idle" | "loading" | "success" | "error";
  errorMessage?: string;
}

// Regional fallback database by PIN Code prefix for instant client-side auto-fill
const PINCODE_PREFIX_MAP: Record<string, { state: string; district: string; city: string }> = {
  "11": { state: "Delhi (NCT)", district: "New Delhi", city: "Delhi" },
  "40": { state: "Maharashtra", district: "Mumbai Suburban", city: "Mumbai" },
  "41": { state: "Maharashtra", district: "Pune", city: "Pune" },
  "42": { state: "Maharashtra", district: "Nashik", city: "Nashik" },
  "44": { state: "Maharashtra", district: "Nagpur", city: "Nagpur" },
  "38": { state: "Gujarat", district: "Ahmedabad", city: "Ahmedabad" },
  "39": { state: "Gujarat", district: "Surat", city: "Surat" },
  "56": { state: "Karnataka", district: "Bengaluru Urban", city: "Bengaluru" },
  "57": { state: "Karnataka", district: "Mysuru", city: "Mysuru" },
  "60": { state: "Tamil Nadu", district: "Chennai", city: "Chennai" },
  "64": { state: "Tamil Nadu", district: "Coimbatore", city: "Coimbatore" },
  "70": { state: "West Bengal", district: "Kolkata", city: "Kolkata" },
  "50": { state: "Telangana", district: "Hyderabad", city: "Hyderabad" },
  "52": { state: "Andhra Pradesh", district: "NTR / Vijayawada", city: "Vijayawada" },
  "53": { state: "Andhra Pradesh", district: "Visakhapatnam", city: "Visakhapatnam" },
  "30": { state: "Rajasthan", district: "Jaipur", city: "Jaipur" },
  "34": { state: "Rajasthan", district: "Jodhpur", city: "Jodhpur" },
  "20": { state: "Uttar Pradesh", district: "Gautam Buddha Nagar", city: "Noida" },
  "22": { state: "Uttar Pradesh", district: "Lucknow", city: "Lucknow" },
  "28": { state: "Uttar Pradesh", district: "Agra", city: "Agra" },
  "14": { state: "Punjab", district: "Ludhiana", city: "Ludhiana" },
  "16": { state: "Chandigarh", district: "Chandigarh", city: "Chandigarh" },
  "12": { state: "Haryana", district: "Gurugram", city: "Gurugram" },
  "68": { state: "Kerala", district: "Ernakulam", city: "Kochi" },
  "69": { state: "Kerala", district: "Thiruvananthapuram", city: "Thiruvananthapuram" },
  "80": { state: "Bihar", district: "Patna", city: "Patna" },
  "83": { state: "Jharkhand", district: "Ranchi", city: "Ranchi" },
  "45": { state: "Madhya Pradesh", district: "Indore", city: "Indore" },
  "46": { state: "Madhya Pradesh", district: "Bhopal", city: "Bhopal" },
  "75": { state: "Odisha", district: "Khurda", city: "Bhubaneswar" },
  "78": { state: "Assam", district: "Kamrup Metropolitan", city: "Guwahati" },
  "19": { state: "Jammu and Kashmir", district: "Srinagar", city: "Srinagar" },
  "24": { state: "Uttarakhand", district: "Dehradun", city: "Dehradun" },
  "403": { state: "Goa", district: "North Goa", city: "Panaji" },
  "737": { state: "Sikkim", district: "Gangtok", city: "Gangtok" },
  "795": { state: "Manipur", district: "Imphal East", city: "Imphal" },
  "793": { state: "Meghalaya", district: "East Khasi Hills", city: "Shillong" },
  "796": { state: "Mizoram", district: "Aizawl", city: "Aizawl" },
  "797": { state: "Nagaland", district: "Kohima", city: "Kohima" },
  "799": { state: "Tripura", district: "West Tripura", city: "Agartala" },
  "744": { state: "Andaman and Nicobar Islands", district: "South Andaman", city: "Port Blair" },
};

/**
 * Fetch PIN Code location info from India Post API with instant regional fallback
 */
export async function fetchPincodeDetails(pincode: string): Promise<PincodeInfo> {
  const cleaned = pincode.replace(/\D/g, "").slice(0, 6);

  if (cleaned.length !== 6) {
    return {
      pincode: cleaned,
      state: "",
      district: "",
      city: "",
      postOffices: [],
      status: "idle",
    };
  }

  // Instant prefix lookup for immediate responsiveness
  const p3 = cleaned.slice(0, 3);
  const p2 = cleaned.slice(0, 2);
  const fallback = PINCODE_PREFIX_MAP[p3] || PINCODE_PREFIX_MAP[p2] || {
    state: "India",
    district: "Local District",
    city: "Local City",
  };

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleaned}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const poList = data[0].PostOffice;
        const firstPO = poList[0];

        const stateName = firstPO.State || fallback.state;
        const districtName = firstPO.District || fallback.district;
        const cityName = firstPO.Name || firstPO.Block || fallback.city;
        const postOffices = poList.map((po: any) => po.Name);

        return {
          pincode: cleaned,
          state: stateName,
          district: districtName,
          city: cityName,
          postOffices,
          status: "success",
        };
      }
    }
  } catch (err) {
    console.warn("India Post Pincode API unavailable, using fallback:", err);
  }

  // Fallback return if API is slow or offline
  return {
    pincode: cleaned,
    state: fallback.state,
    district: fallback.district,
    city: fallback.city,
    postOffices: [fallback.city],
    status: "success",
  };
}
