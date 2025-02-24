import axios from "axios";
import { EXCHANGE_RATE_API_KEY } from "../config/config";
import { ErrorHandlers } from "./errorHandler";

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
        throw new ErrorHandlers().ValidationError(`Conversion rate not found for ${toCurrency}`);
      }

      const conversionRate = data.conversion_rates[toCurrency];
      const convertedAmount = amount * conversionRate;

      // Get currency symbol
      const currencySymbol = await this.getCurrencySymbol(toCurrency);

      return {
        convertedAmount: this.bankersRound(convertedAmount),
        rate: conversionRate,
        currency:toCurrency,
        symbol:currencySymbol

      };
    } catch (error) {
      console.error("Error converting currency:", error);
      return {
        convertedAmount: `${amount.toFixed(2)}`, // Default fallback
        rate: 1,
        symbol:"$",
        currency:'usd'
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

  private formatCurrency(amount: number): string {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  	bankersRound(number: number): string {
		// Function to check if a number is exactly halfway between two integers
		const isHalfway = (num: number) => Math.abs(num - Math.round(num)) === 0.5;
		
		let rounded: number;
		if (isHalfway(number)) {
			// If the number is halfway, determine if the integer part is even
			if (Math.floor(number) % 2 === 0) {
				rounded = Math.floor(number);
			} else {
				rounded = Math.ceil(number);
			}
		} else {
			// For non-halfway numbers, use standard rounding and apply two decimal rounding here
			rounded = Math.round(number * 100) / 100;
		}
		
		// Format the rounded number to always have two decimal places
		return rounded.toFixed(2);
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
      locationData.data.convertedCurrency = conversion.currency
      locationData.data.symbol = conversion.symbol
    }

    return locationData;
  }
}
