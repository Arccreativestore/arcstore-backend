import axios from "axios";
import { EXCHANGE_RATE_API_KEY } from "../config/config";

export class LocationService {
   async getLocationByIP() {
    try {
      const { data } = await axios.get(`https://ipapi.co/json/`);

      const {
        latitude,
        longitude,
        country,
        country_code,
        city,
        currency,
        currency_name,
        country_calling_code,
        continent_code,
      } = data;

      return {
        message: "Location data successfully retrieved",
        data: {
          latitude,
          longitude,
          country,
          country_code,
          city,
          currency,
          currency_name,
          country_calling_code,
          continent_code,
        },
      };
    } catch (error) {
      console.error("Error fetching location:", error);
      return {
        message: "Failed to retrieve location",
        data: {
          country: "Unknown",
          city: "Unknown",
          currency: "USD",
        },
      };
    }
  }

  private async convertCurrency(amount: number, toCurrency: string) {
    try {

      const { data } = await axios.get(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`
      );

      if (!data.conversion_rates[toCurrency]) {
        throw new Error(`Conversion rate not found for ${toCurrency}`);
      }

      const conversionRate = data.conversion_rates[toCurrency];
      const convertedAmount = amount * conversionRate;

      // Get currency symbol
      const currencySymbol = await this.getCurrencySymbol(toCurrency);

      return {
        convertedAmount: this.formatCurrency(convertedAmount, currencySymbol),
        rate: conversionRate,
      };
    } catch (error) {
      console.error("Error converting currency:", error);
      return {
        convertedAmount: `$${amount.toFixed(2)}`, // Default fallback
        rate: 1,
      };
    }
  }

  private async getCurrencySymbol(currencyCode: string): Promise<string> {
    try {
      const { data } = await axios.get("https://restcountries.com/v3.1/all");
      const country = data.find((c: any) => c.currencies && c.currencies[currencyCode]);

      if (country && country.currencies[currencyCode]?.symbol) {
        return country.currencies[currencyCode].symbol;
      }

      return currencyCode; // Fallback: return the currency code if symbol not found
    } catch (error) {
      console.error("Error fetching currency symbol:", error);
      return currencyCode;
    }
  }

  private formatCurrency(amount: number, symbol: string): string {
    return `${symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  public async getUserLocationWithCurrency(amountInUSD: number) {
    const locationData:any = await this.getLocationByIP();

    if (locationData.data.currency) {
      const conversion = await this.convertCurrency(
        amountInUSD,
        locationData.data.currency
      );
      locationData.data.convertedAmount = conversion.convertedAmount;
      locationData.data.conversionRate = conversion.rate;
    }

    return locationData;
  }
}
