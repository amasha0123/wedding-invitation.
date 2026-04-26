document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Guest Name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('name');
    const guestDisplay = document.getElementById('guestName');

    if (guestName) {
        guestDisplay.textContent = `Dear ${decodeURIComponent(guestName)},`;
    } else {
        guestDisplay.textContent = "Dear Loved One,";
    }

    // 2. Handle Loader
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                mainContent.classList.add('loaded');
            }, 500);
        }, 1000); // Small delay for aesthetic effect
    });

    // 3. Save to Calendar Functionality
    const calendarBtn = document.getElementById('calendarBtn');
    calendarBtn.addEventListener('click', () => {
        const event = {
            title: 'Wedding of Anuradha & Poornima',
            description: 'We joyfully invite you to celebrate our wedding!',
            location: 'Ella Flower Garden Hotel, Ella',
            startTime: '20260504T090000',
            endTime: '20260504T150000' // Assuming a 6-hour event
        };

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${event.startTime}`,
            `DTEND:${event.endTime}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description}`,
            `LOCATION:${event.location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'wedding_invitation.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 4. Sharing Logic
    const shareBtn = document.getElementById('shareBtn');
    const shareNameInput = document.getElementById('shareName');
    const shareStatus = document.getElementById('shareStatus');

    shareBtn.addEventListener('click', async () => {
        const nameToShare = shareNameInput.value.trim();
        if (!nameToShare) {
            shareStatus.textContent = "Please enter a name first.";
            shareStatus.style.color = "#d32f2f";
            return;
        }

        // Generate the URL (using the current base URL)
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?name=${encodeURIComponent(nameToShare)}`;
        const shareTitle = "Wedding Invitation: Anuradha & Poornima";
        const shareText = `🌸 You're Invited! 🌸\n\nDear ${nameToShare},\n\nWe joyfully invite you to celebrate our wedding!\n\n📅 Monday, 04 May 2026\n⏰ 9:00 AM\n📍 Ella Flower Garden Hotel, Ella\n\n✨ Our Wedding Invitation: ${shareUrl}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl
                });
                shareStatus.textContent = "Shared successfully!";
                shareStatus.style.color = "#2e7d32";
            } catch (err) {
                console.error("Share failed:", err);
                // Fallback to copy if they cancel share sheet but we want to show something? 
                // Usually cancellation is fine, but if it's an error we should handle it.
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(shareText);
                shareStatus.textContent = "Link & message copied to clipboard!";
                shareStatus.style.color = "#2e7d32";
            } catch (err) {
                shareStatus.textContent = "Failed to copy. Please copy the URL manually.";
                shareStatus.style.color = "#d32f2f";
            }
        }

        // Clear status after 3 seconds
        setTimeout(() => {
            shareStatus.textContent = "";
        }, 3000);
    });
});
