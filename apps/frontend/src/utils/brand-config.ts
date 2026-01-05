export const getBrandConfig = () => {
    return {
        appName: process.env.NEXT_PUBLIC_APP_NAME || 'Postquee',
        appLogo: process.env.NEXT_PUBLIC_APP_LOGO || '/postquee.png',
        appFavicon: process.env.NEXT_PUBLIC_APP_FAVICON || '/favicon.ico',
        supportEmail: 'benami.omri2@gmail.com',
    };
};
