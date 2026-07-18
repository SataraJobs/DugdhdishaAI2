// 1. नोटिफिकेशन तयार करून LocalStorage मध्ये सेव्ह करणे (उदा. कंपनीने प्रॉडक्ट ॲड केल्यावर)
function sendNotification(title, message, targetRole) {
    // जुने नोटिफिकेशन्स घ्या किंवा नवीन रिकामी लिस्ट बनवा
    let notifications = JSON.parse(localStorage.getItem('system_notifications')) || [];
    
    // नवीन नोटिफिकेशन तयार करा
    let newNotif = {
        id: Date.now(),
        title: title,
        message: message,
        target: targetRole, // 'all', 'admin', 'farmer'
        time: new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })
    };
    
    // नवीन नोटिफिकेशन लिस्टच्या सर्वात वर ॲड करा
    notifications.unshift(newNotif); 
    
    // पुन्हा LocalStorage मध्ये सेव्ह करा
    localStorage.setItem('system_notifications', JSON.stringify(notifications));
}

// 2. पेज लोड झाल्यावर नोटिफिकेशन्स दाखवणे
function loadNotifications(currentRole) {
    let notifications = JSON.parse(localStorage.getItem('system_notifications')) || [];
    
    // फक्त या युजरला (Role) लागू असलेले नोटिफिकेशन्स फिल्टर करा
    let myNotifications = notifications.filter(n => n.target === currentRole || n.target === 'all');
    
    let badge = document.getElementById('notif_badge');
    let dropdown = document.getElementById('notificationDropdown');
    
    if(!badge || !dropdown) return; // पेजवर बेल आयकॉन नसेल तर थांबा

    // लाल रंगातील बॅजवरील आकडा अपडेट करा
    badge.innerText = myNotifications.length;
    if(myNotifications.length === 0) {
        badge.style.display = 'none'; // शून्य असल्यास लपवा
    } else {
        badge.style.display = 'inline-block';
    }

    // ड्रॉपडाऊन मधील HTML डिझाईन तयार करा
    let html = `<h4 style="margin: 0 0 10px 0; font-size: 13px; color: #1b5e20; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                    सूचना (Notifications) 
                    <button onclick="clearNotifications('${currentRole}')" style="float:right; font-size:10px; cursor:pointer; border:none; background:#ffcdd2; color:#c62828; border-radius:4px; padding: 2px 5px;">Clear</button>
                </h4>`;
    
    if(myNotifications.length === 0) {
        html += `<div style="font-size: 12px; color: #666; padding: 10px; text-align:center;">कोणतीही नवीन सूचना नाही.</div>`;
    } else {
        myNotifications.forEach(n => {
            html += `<div style="font-size: 12px; color: #444; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                        <b style="color:#0d47a1;">${n.title}</b><br>
                        ${n.message}
                        <div style="font-size:9px; color:#999; margin-top:3px;">⏰ ${n.time}</div>
                    </div>`;
        });
    }
    dropdown.innerHTML = html;
}

// 3. बेल आयकॉनवर क्लिक केल्यावर ड्रॉपडाऊन ओपन/क्लोज करणे
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

// 4. सर्व नोटिफिकेशन्स डिलीट करणे
function clearNotifications(currentRole) {
    localStorage.removeItem('system_notifications');
    loadNotifications(currentRole); // पेज रिफ्रेश करा
    toggleNotifications(); // ड्रॉपडाऊन बंद करा
}
