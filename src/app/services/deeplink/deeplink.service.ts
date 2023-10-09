import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeeplinkService {
  constructor(private readonly httpService: HttpService) {}
  async createDeeplink(longDynamicLink?: any): Promise<string> {
    try {
      /*    const longDynamicLink =
        'https://summercircles.page.link/?efr=0&ibi=com.borneagency.Summercircles&apn=com.borneagency.Summercircles&imv=1&amv=1&link=https%3A%2F%2Fwww.google.com%2FbookingInvitation%3FcampId%3D123123123';
 */
      const data = JSON.stringify({ longDynamicLink });
      const apiKey = 'AIzaSyCYkq3tPffXgEPR_A5Yv1_YMexRnvwtvsc'; // Replace with your actual Firebase API key

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await this.httpService
        .post(
          `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`,
          data,
          config,
        )
        .toPromise();

      return response.data.shortLink;
    } catch (error) {
      if (error.response) {
        // If the error contains response data, log it for debugging purposes
        console.error('Error response from Firebase API:', error.response.data);
      }
      console.error('Error creating short dynamic link:', error);
      throw new Error('Failed to create short dynamic link');
    }
  }
}
