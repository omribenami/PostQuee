/**
 * PostQuee Brand Configuration
 *
 * This file contains customized branding configuration for PostQuee,
 * a white-label distribution of the open-source Postiz project.
 *
 * Original Project: Postiz by Gitroom
 * Repository: https://github.com/gitroomhq/postiz-app
 * License: GNU Affero General Public License v3.0 (AGPL-3.0)
 *
 * This branding system is a modification of the original Postiz source code
 * and is also covered under AGPL-3.0. As PostQuee is provided as a network
 * service (SaaS), the complete source code is available at:
 * https://github.com/omribenami/PostQuee
 *
 * Users interacting with PostQuee over a network have the right to receive
 * the complete corresponding source code in compliance with AGPL-3.0 Section 13.
 */

export const getBrandConfig = () => {
    return {
        appName: process.env.NEXT_PUBLIC_APP_NAME || 'Postquee',
        appLogo: process.env.NEXT_PUBLIC_APP_LOGO || '/postquee.png',
        appFavicon: process.env.NEXT_PUBLIC_APP_FAVICON || '/favicon.ico',
        supportEmail: 'benami.omri2@gmail.com',
    };
};
