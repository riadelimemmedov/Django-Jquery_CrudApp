//!Xeta mesajlarinin yazilmasi ucun istifade olunann js fayli

const handleAlerts = (type,text) =>{
    alertBox.innerHTML = `
        <div class="alert alert-${type}">
            <strong>${text}</strong>
        </div>
    `
}