import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welcome to Kebabkartan! 🥙",
      verificationEmailBody: (createCode) => `
🥙 Welcome to Kebabkartan! 🥙

Thank you for joining our community of kebab enthusiasts!

Your confirmation code is: ${createCode()}

Enter this code in the app to complete your registration.

Happy kebab hunting!
- The Kebabkartan Team
      `,
    },
  },
});
