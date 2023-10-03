// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
interface GeolocationData {
  // Define the structure of your geolocation data
  // Adjust these types based on the actual response structure from the API
  // For example purposes, assuming a simple structure here
  city: string;
  country: string;
  // Add other properties as needed
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeolocationData>
) {
  const { ipAddress } = req.query;
  const { domain } = req.query;
  if (!ipAddress || typeof ipAddress !== "string") {
    console.error("Invalid Ip Address");
  }
  if (!domain || typeof domain !== "string") {
    console.error("Invalid Ip Address");
  }
  try {
    // Replace 'your_api_key_here' and 'https://api.example.com/ipgeolocation' with your actual API key and endpoint
    const ipifyApiKey = process.env.IPIFYKEY; // Replace with your actual ipify API key
    const response = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=${ipifyApiKey}&ipAddress=${ipAddress}`);
    const geolocationData: GeolocationData = response.data;

    // const ipifyResponse = await fetch(`https://geo.ipify.org/api/v2/ip?apiKey=${ipifyApiKey}&domain=${domain}`);
    // const ipifyData = await ipifyResponse.json();
    res.status(200).json(geolocationData);
  } catch (error) {
    console.error("Error fetching IP geolocation data:", error);
  }
}
