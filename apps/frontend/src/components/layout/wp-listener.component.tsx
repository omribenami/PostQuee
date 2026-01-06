'use client';
import { useEffect, useRef } from 'react';
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
    const { data: integrationsData } = useSWR('/integrations', async (url) => {
        return (await fetch(url)).json();
    }, {
        revalidateOnFocus: false,
    });

    const integrations = Array.isArray(integrationsData) ? integrationsData : [];

    const pendingMessage = useRef<any>(null);

    // Helper to process the message and open modal
    const processMessage = (data: any) => {
        const { post_title, post_url, featured_image, excerpt } = data;
        const content = `${post_title}\n\n${excerpt}\n\n${post_url}`;
        const media = featured_image ? [{ id: 'wp-import', path: featured_image }] : [];
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
                    allIntegrations={integrations.map((p: any) => ({ ...p }))}
                    integrations={integrations}
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
    };

    // Effect to process pending message once integrations are loaded
    useEffect(() => {
        if (integrations) {
            // Check memory buffer
            if (pendingMessage.current) {
                console.log('PostQuee: Integrations loaded, processing pending message.');
                processMessage(pendingMessage.current);
                pendingMessage.current = null;
            }

            // Check localStorage (persisted from Login page)
            if (typeof localStorage !== 'undefined') {
                try {
                    const storedPost = localStorage.getItem('pending-wp-post');
                    if (storedPost) {
                        console.log('PostQuee: Found pending post from Login, processing.');
                        try {
                            const data = JSON.parse(storedPost);
                            processMessage(data);
                            localStorage.removeItem('pending-wp-post');
                        } catch (e) {
                            console.error('Failed to parse pending post', e);
                        }
                    }
                } catch (e) {
                    console.error('PostQuee: LocalStorage access failed (Corruption detected)', e);
                }
            }
        }
    }, [integrations, modal]);

    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            console.log('[PostQuee App] Received postMessage:', event.data);
            console.log('[PostQuee App] Event origin:', event.origin);

            if (event.data?.type === 'create-post-from-wp' && event.data?.data) {
                console.log('[PostQuee App] WordPress message detected!');
                console.log('[PostQuee App] Message data:', event.data.data);
                console.log('[PostQuee App] Integrations loaded:', !!integrations);
                console.log('[PostQuee App] Integrations length:', integrations?.length);

                if (!integrations || integrations.length === 0) {
                    console.log('[PostQuee App] Integrations not ready, buffering message.');
                    pendingMessage.current = event.data.data;
                    return;
                }
                console.log('[PostQuee App] Processing message immediately...');
                processMessage(event.data.data);
            }
        };

        console.log('[PostQuee App] WPPostMessageListener mounted');
        console.log('[PostQuee App] Integrations available:', !!integrations);
        console.log('[PostQuee App] Integrations count:', integrations?.length);

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
