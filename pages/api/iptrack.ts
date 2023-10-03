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

  try {
    const ipifyApiKey = process.env.IPIFYKEY;
    if (ipAddress || typeof ipAddress === "string") {
      const response = await axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${ipifyApiKey}&ipAddress=${ipAddress}`
      );
      const geolocationData: GeolocationData = response.data;
      res.status(200).json(geolocationData);
    } else if (!ipAddress || typeof ipAddress !== "string") {
      console.log("error getting IP location");
    }

    if (domain || typeof domain === "string") {
      const ipAddress2 = await resolveDomainToIP(domain);
      const response = await axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${ipifyApiKey}&ipAddress=${ipAddress2}`
      );
      const geolocationData: GeolocationData = response.data;
      res.status(200).json(geolocationData);
    } else if (!domain || typeof domain !== "string") {
      console.log("error getting domain location");
    }
  } catch (error) {
    console.error("Error fetching IP geolocation data:", error);
  }
}

const ipCache = new Map<string, string>();

async function resolveDomainToIP(domain: any): Promise<string> {
  if (ipCache.has(domain)) {
    return ipCache.get(domain)!;
  }

  return new Promise((resolve, reject) => {
    require("dns").resolve4(domain, (err: any, addresses: any) => {
      if (err) {
        reject(err);
      } else {
        const ipAddress = addresses[0];
        ipCache.set(domain, ipAddress);
        resolve(ipAddress);
      }
    });
  });
}
