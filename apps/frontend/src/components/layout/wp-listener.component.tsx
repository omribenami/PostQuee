'use client';
import { useCallback, useEffect, useRef } from 'react';
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
    const load = useCallback(async (path: string) => {
        return (await (await fetch(path)).json()).integrations;
    }, []);

    const { data: integrations, isLoading } = useSWR('/integrations/list', load, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        revalidateOnMount: true,
        refreshWhenHidden: false,
        refreshWhenOffline: false,
        fallbackData: [],
    });

    const pendingMessage = useRef<any>(null);
    // Track processed messages to prevent duplicates from retry attempts
    const lastProcessedUrl = useRef<string | null>(null);

    // Helper to process the message and open modal
    const processMessage = (data: any) => {
        try {
            console.log('[PostQuee App] processMessage called with data:', data);
            const { post_title, post_url, featured_image, excerpt } = data;

            // Check if we already processed this exact post URL
            if (lastProcessedUrl.current === post_url) {
                console.log('[PostQuee App] Duplicate message detected, ignoring (URL:', post_url, ')');
                return;
            }

            // Mark this URL as processed
            lastProcessedUrl.current = post_url;
            console.log('[PostQuee App] Processing new message for URL:', post_url);

            const content = `${post_title}\n\n${excerpt}\n\n${post_url}`;
            const media = featured_image ? [{ id: 'wp-import', path: featured_image }] : [];
            const date = dayjs();

            console.log('[PostQuee App] Opening modal with content:', content);
            console.log('[PostQuee App] Media:', media);
            console.log('[PostQuee App] Modal object:', modal);

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

            console.log('[PostQuee App] Modal.openModal called successfully');
        } catch (error) {
            console.error('[PostQuee App] Error in processMessage:', error);
        }
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
                console.log('[PostQuee App] Integrations loading:', isLoading);
                console.log('[PostQuee App] Integrations length:', integrations?.length);

                // Only buffer if the API call hasn't completed yet
                if (isLoading) {
                    console.log('[PostQuee App] Integrations API still loading, buffering message.');
                    pendingMessage.current = event.data.data;
                    return;
                }

                // If integrations loaded but empty, still open the modal
                // The user can connect integrations from within the modal
                console.log('[PostQuee App] Processing message (integrations: ' + integrations.length + ')');
                processMessage(event.data.data);
            }
        };

        console.log('[PostQuee App] WPPostMessageListener mounted');
        console.log('[PostQuee App] Integrations available:', !!integrations);
        console.log('[PostQuee App] Integrations count:', integrations?.length);

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [modal, integrations, isLoading]);

    // Handle resize logic to send back to parent
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
