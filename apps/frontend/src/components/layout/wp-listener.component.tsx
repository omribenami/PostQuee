'use client';
import { useEffect } from 'react';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { AddEditModal } from '@gitroom/frontend/components/new-launch/add.edit.modal';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { useVariables } from '@gitroom/react/helpers/variable.context';

export const WPPostMessageListener = () => {
    const modal = useModals();
    const fetch = useFetch();
    const { isGeneral } = useVariables();

    // Fetch integrations as we need them for the modal
    const { data: integrations } = useSWR('/integrations', async (url) => {
        return (await fetch(url)).json();
    }, {
        revalidateOnFocus: false,
    });

    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            // Check for specific message type
            if (event.data?.type === 'create-post-from-wp' && event.data?.data) {
                if (!integrations) {
                    console.warn('PostQuee: Integrations not loaded yet, ignoring WP message');
                    return;
                }

                const { post_title, post_url, featured_image, excerpt } = event.data.data;

                // Construct standard HTML content
                const content = `${post_title}\n\n${excerpt}\n\n${post_url}`;

                // Simple media object structure - PostQuee/Postiz handles media differently, usually expects uploaded ID or path
                // For external images, we might pass the URL directly if supported, or we might need to upload it.
                // Postiz seems to support 'path' in media object.
                const media = featured_image ? [{ id: 'wp-import', path: featured_image }] : [];

                // We use current date/time
                const date = dayjs();

                modal.openModal({
                    id: 'add-edit-modal-wp',
                    closeOnClickOutside: false,
                    removeLayout: true,
                    closeOnEscape: false,
                    withCloseButton: false,
                    askClose: true,
                    fullScreen: true,
                    classNames: {
                        modal: 'w-[100%] max-w-[1400px] text-textColor',
                    },
                    children: (
                        <AddEditModal
                            allIntegrations={integrations?.map((p: any) => ({ ...p })) || []}
                            integrations={integrations || []}
                            date={date}
                            reopenModal={() => { }}
                            mutate={() => { }}
                            onlyValues={[{
                                content: content,
                                image: media
                            }]}
                        />
                    ),
                    size: '80%',
                    title: ``,
                });
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [modal, integrations]);

    // Also handle resize logic here to send back to parent?
    // User asked: "PostQuee frontend (Next.js) to listen for this specific postMessage"
    // User also asked: "Smart Resizing: Use the window.postMessage API... Add a script to the plugin... Add a listener"
    // Wait, the RESIZE listener is in the PLUGIN. The APP needs to SEND the resize event.
    // I should add a resize observer here to send height to parent.

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const sendResize = () => {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ type: 'resize', height }, '*');
        };

        const observer = new ResizeObserver(sendResize);
        observer.observe(document.body);

        // Also send on load
        sendResize();

        return () => observer.disconnect();
    }, []);

    return null;
};
