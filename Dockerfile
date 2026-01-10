FROM ghcr.io/gitroomhq/postiz-app:latest

# 1. מעתיקים את המיתוג לתיקייה זמנית בתוך האימג'
COPY ./branding /tmp/branding

# 2. הפקודה הזו דורסת את הקבצים בכל שלושת הנתיבים האפשריים של Next.js ו-Nx
# ה- "|| true" דואג שהבנייה לא תיכשל אם אחד הנתיבים לא קיים
RUN cp -rf /tmp/branding/* /app/apps/frontend/public/ || true \
    && cp -rf /tmp/branding/* /app/apps/frontend/.next/standalone/apps/frontend/public/ || true \
    && cp -rf /tmp/branding/* /app/dist/apps/frontend/public/ || true

# ניקוי זבל
RUN rm -rf /tmp/branding
