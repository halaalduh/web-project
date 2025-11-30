window.onload = function () {

    var backBtn = document.getElementById("backToTopBtn");

    if (backBtn) {
        window.onscroll = function () {
            if (window.scrollY > 300) {
                backBtn.classList.add("show");
            } else {
                backBtn.classList.remove("show");
            }
        };

        backBtn.onclick = function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };
    }

    var clockSpan = document.getElementById("footerClock");

    if (clockSpan) {
        function updateClock() {
            var now = new Date();
            clockSpan.innerHTML = now.toLocaleTimeString("en-SA", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    var body = document.body;
    var storedTheme = localStorage.getItem("pbTheme");

    if (storedTheme === "dark") {
        body.classList.add("theme-dark");
    }

    var themeToggleBtn = document.getElementById("themeToggle");

    if (themeToggleBtn) {

        function updateThemeButtonText() {
            if (body.classList.contains("theme-dark")) {
                themeToggleBtn.innerHTML = "Light Theme";
            } else {
                themeToggleBtn.innerHTML = "Dark Theme";
            }
        }

        updateThemeButtonText();

        themeToggleBtn.onclick = function () {
            body.classList.toggle("theme-dark");

            var isDark = body.classList.contains("theme-dark");

            if (isDark) {
                localStorage.setItem("pbTheme", "dark");
            } else {
                localStorage.setItem("pbTheme", "light");
            }

            updateThemeButtonText();
        };
    }

    var sortSelect = document.getElementById("sort");
    var cardGrid = document.getElementsByClassName("cardgrid")[0];

    if (sortSelect && cardGrid) {

        function getCardName(card) {
            var titleElement = card.getElementsByClassName("cardtitle")[0];
            if (titleElement) {
                return titleElement.innerHTML.toLowerCase();
            }
            return "";
        }

        function getCardPrice(card) {
            var priceElement = card.getElementsByClassName("price-tag")[0];
            if (!priceElement) {
                return 0;
            }

            var text = priceElement.innerHTML;
            var match = text.match(/(\d+(\.\d+)?)/);
            if (match) {
                return parseFloat(match[1]);
            }
            return 0;
        }

        function shuffleCards() {
            var cards = cardGrid.getElementsByClassName("servcard");
            var tempArray = [];
            var i, j, temp;

            for (i = 0; i < cards.length; i++) {
                tempArray.push(cards[i]);
            }

            for (i = tempArray.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                temp = tempArray[i];
                tempArray[i] = tempArray[j];
                tempArray[j] = temp;
            }

            cardGrid.innerHTML = "";
            for (i = 0; i < tempArray.length; i++) {
                cardGrid.appendChild(tempArray[i]);
            }
        }

        function sortAndRender(criteria) {
            var cards = cardGrid.getElementsByClassName("servcard");
            var cardsArray = [];
            var i;

            for (i = 0; i < cards.length; i++) {
                cardsArray.push(cards[i]);
            }

            cardsArray.sort(function (a, b) {
                if (criteria === "name_az") {
                    var nameA = getCardName(a);
                    var nameB = getCardName(b);
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                }

                if (criteria === "name_za") {
                    var nameA2 = getCardName(a);
                    var nameB2 = getCardName(b);
                    if (nameA2 > nameB2) return -1;
                    if (nameA2 < nameB2) return 1;
                    return 0;
                }

                if (criteria === "price_low") {
                    return getCardPrice(a) - getCardPrice(b);
                }

                if (criteria === "price_high") {
                    return getCardPrice(b) - getCardPrice(a);
                }

                return 0;
            });

            cardGrid.innerHTML = "";
            for (i = 0; i < cardsArray.length; i++) {
                cardGrid.appendChild(cardsArray[i]);
            }
        }

        shuffleCards();

        sortSelect.onchange = function () {
            var selectedValue = sortSelect.value;
            sortAndRender(selectedValue);
        };
    }

/* 
    DEFAULT STAFF
 */

if (localStorage.getItem("staffList") === null) {
    var defaultStaff = [
        { name: "Lara", skills: "Hair Styling, Makeup", photo: "images/user.png" },
        { name: "Lama", skills: "Skin care", photo: "images/user.png" },
        { name: "Sara", skills: "Massage", photo: "images/user.png" },
        { name: "Noura", skills: "Hair Treatment", photo: "images/user.png" }
    ];
    localStorage.setItem("staffList", JSON.stringify(defaultStaff));
}


/* 
  ADD NEW SERVICE PAGE 
*/
function handleAddServicePage() {

    var forms = document.getElementsByClassName("join-form");
    if (forms.length === 0) { 
        return; 
    }

    var form = forms[0];

    form.onsubmit = function (e) {
        e.preventDefault();

        // Read name INSIDE submit handler
        var nameInput = form.querySelector('input[type="text"]');
        var name = nameInput.value.trim();

        var inputs = form.getElementsByTagName("input");
        var imageInput = inputs[1];  // because input[0] = name now
        var price = inputs[2].value;

        var textareas = form.getElementsByTagName("textarea");
        var desc = textareas[0].value;

        var file = imageInput.files[0];

        if (name === "" || !file || price === "" || desc === "") {
            alert("Please fill all fields.");
            return;
        }

        /* Accept only image files */
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file (jpg, png, gif...).");
            return;
        }

        /* Description must contain letters only */
        if (/^\d+$/.test(desc)) {
            alert("Description must contain words, not only numbers.");
            return;
        }

        /* Extract filename */
        var parts = imageInput.value.split("\\");
        var imageName = parts[parts.length - 1];

        if (!isNaN(name.charAt(0))) {
            alert(" name cannot start with a number.");
            return;
        }

        if (isNaN(price)) {
            alert("Price must be a number.");
            return;
        }

        var services = JSON.parse(localStorage.getItem("services") || "[]");

        var newService = {
            name: name,
            price: price,
            desc: desc,
            img: "images/" + imageName
        };

        services.push(newService);
        localStorage.setItem("services", JSON.stringify(services));

        alert('Service "' + name + '" has been added successfully!');
        form.reset();
    };
}



/*
PROVIDER DASHBOARD 
 */
function handleDashboardPage() {

    var grids = document.getElementsByClassName("cardgrid1");
    if (grids.length === 0) { return; }

    var grid = grids[0];
    grid.innerHTML = "";

    var services = localStorage.getItem("services");
    if (services === null) {
        services = [];
    } else {
        services = JSON.parse(services);
    }

if (services.length === 0) {
    document.getElementById("emptyMsg").innerHTML = "You have not added any services yet.";
grid.innerHTML = "";  

}


    // SHOW ADDED SERVICES
    for (var i = 0; i < services.length; i++) {
        var serv = services[i];

        var card =
            '<article class="servcard1">' +
            '<div class="cardimgwrap">' +
            '<img src="' + serv.img + '" alt="' + serv.name + '">' +
            '</div>' +
            '<h3 class="cardtitle">' + serv.name + '</h3>' +
            '<p class="price-tag">Price: ' + serv.price + ' SAR</p>' +
            '<p class="carddesc">' + serv.desc + '</p>' +
            '</article>';

        grid.innerHTML += card;
    }
}


/* 
  MANAGE STAFF MEMBERS 
 */
function handleManageStaffPage() {

    var staffGridList = document.getElementsByClassName("staff-grid");
    if (staffGridList.length === 0) { return; }

    var staffGrid = staffGridList[0];

    var deleteBtns = document.getElementsByClassName("btnDelet");
    var deleteBtn = deleteBtns[0];

    var forms = document.getElementsByClassName("join-form");
    var form = forms[0]; // second join-form

    // LOAD EXISTING STAFF
    var staff = localStorage.getItem("staffList");
    if (staff === null) {
        staff = [];
    } else {
        staff = JSON.parse(staff);
    }

    function renderStaff() {
        staffGrid.innerHTML = "";

        for (var i = 0; i < staff.length; i++) {
            staffGrid.innerHTML +=
                '<div class="card-wrapper">' +
                '<input type="checkbox" class="select-box" id="staff' + i + '">' +
                '<a class="staff-card">' +
                '<img src="' + staff[i].photo + '">' +
                '<p><strong>' + staff[i].name + '</strong></p>' +
                '<p>' + staff[i].skills + '</p>' +
                '</a></div>';
        }
    }

    renderStaff();

    /* DELETE STAFF  */
    deleteBtn.onclick = function (event) {
    event.preventDefault();   


        var checkboxes = document.getElementsByClassName("select-box");
        var selectedIndexes = [];

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked === true) {
                selectedIndexes.push(i);
            }
        }

        if (selectedIndexes.length === 0) {
            alert("Please select at least one offer.");
            return;
        }

        if (!confirm("Are you sure you want to delete selected staff?")) {
            return;
        }

        var newStaff = [];

        for (var j = 0; j < staff.length; j++) {
            if (selectedIndexes.indexOf(j) === -1) {
                newStaff.push(staff[j]);
            }
        }

        staff = newStaff;
        localStorage.setItem("staffList", JSON.stringify(staff));

        renderStaff();
    };


    /* ADD NEW STAFF  */
    form.onsubmit = function (e) {
        e.preventDefault();

        var inputs = form.getElementsByTagName("input");
        var textareas = form.getElementsByTagName("textarea");

        var name = inputs[0].value;
        var imageInput = inputs[1];
        var birth = inputs[2].value;
        var email = inputs[3].value;

        var skills = textareas[0].value;
        var edu = textareas[1].value;
        var expertise = textareas[2].value;

        var imgValue = imageInput.value;
        var parts = imgValue.split("\\");
        var imageName = parts[parts.length - 1];

        if (name === "" || imgValue === "" || birth === "" || email === "" ||
            skills === "" || edu === "" || expertise === "") {

            alert("All fields are required.");
            return;
        }
		
		var year = new Date(birth).getFullYear();
         if (year > 2008) {
           alert("Date of birth must be before or 2008.");
           return;
}

        if (!isNaN(name.charAt(0))) {
            alert("Name cannot start with a number.");
            return;
        }

        staff.push({
            name: name,
            skills: skills,
            photo: "images/" + imageName
        });

        localStorage.setItem("staffList", JSON.stringify(staff));

        alert('Staff member "' + name + '" has been added!');

        form.reset();
        renderStaff();
    };
}



handleAddServicePage();
handleDashboardPage();
handleManageStaffPage();


/***********************
   REQUEST A SERVICE PAGE
************************/

var requestForm = document.querySelector(".service-form");

if (requestForm && document.getElementById("service")) {

    requestForm.onsubmit = function (e) {
        e.preventDefault();

        var service = document.getElementById("service").value;
        var name = document.getElementById("name").value.trim();
        var date = document.getElementById("date").value;
        var desc = document.getElementById("desc").value.trim();
		
		
        var today = new Date();
        var selected = new Date(date);
        var diff = (selected - today) / (1000 * 3600 * 24);

        if (service === "service") {
            alert("Please select a service.");
            return;
        }

        if (!/^[A-Za-z ]+$/.test(name) || name.split(" ").length < 2) {
            alert("Please enter a valid full name.");
            return;
        }
		
		if (date === "") {
            alert("Please enter a date.");
            return;
        }

        if (diff < 3) {
            alert("Due date is too soon. Choose a date at least 3 days later.");
            return;
        }

        if (desc.length < 100) {
            alert("Description must be at least 100 characters.");
            return;
        }

        var stay = confirm("Your request was sent successfully! Stay here or go to dashboard?");

        if (stay) {

            var list = document.createElement("div");
            list.className = "added-request";

            list.innerHTML =
                "<p><strong>Service:</strong> " + service + "</p>" +
                "<p><strong>Name:</strong> " + name + "</p>" +
                "<p><strong>Date:</strong> " + date + "</p>" +
                "<p><strong>Description:</strong> " + desc + "</p><hr>";

            document.querySelector(".dashboard-card").appendChild(list);

        } else {
            window.location.href = "customer-dashboard.html";
        }
    };
}



/***********************
    SERVICE EVALUATION PAGE
************************/

var stars = document.querySelectorAll(".stars span");

if (stars.length > 0) {

    var rating = 0;

    stars.forEach(function (star, index) {
        star.onclick = function () {

            rating = index + 1;

            stars.forEach(function (s) {
                s.style.color = "#ccc";
            });

            for (var i = 0; i <= index; i++) {
                stars[i].style.color = "gold";
            }
        };
    });

    document.querySelector(".service-form").onsubmit = function (e) {
        e.preventDefault();

        var service = document.getElementById("previous-service").value;
        var feedback = document.getElementById("feedback").value.trim();

        if (service === "previous service") {
            alert("Please select a service.");
            return;
        }

        if (rating === 0) {
            alert("Please add a rating.");
            return;
        }

        if (feedback === "") {
            alert("Please enter your feedback.");
            return;
        }

        if (rating >= 4) {
            alert("Thank you for your positive feedback!");
        } else {
            alert("We are sorry your experience was not perfect. We will improve.");
        }

        window.location.href = "customer-dashboard.html";
    };
}



/***********************
        FAQ PAGE
************************/

var faqItems = document.querySelectorAll(".faq-item");

if (faqItems.length > 0) {

    faqItems.forEach(function (item) {
        var question = item.querySelector("h4");
        var answer = item.querySelector("p");

        answer.style.display = "none";

        question.onclick = function () {
            if (answer.style.display === "none") {
                answer.style.display = "block";
            } else {
                answer.style.display = "none";
            }
        };
    });
}


var faqForm = document.querySelector(".faq-form");

if (faqForm) {

    faqForm.onsubmit = function (e) {
        e.preventDefault();

        var text = faqForm.querySelector("textarea").value.trim();

        if (text === "") {
            alert("Please write a question.");
            return;
        }

        var newItem = document.createElement("div");
        newItem.className = "faq-item";

        newItem.innerHTML =
            "<h4>" + text + "</h4>" +
            "<p>Thank you! Our team will respond soon.</p>";

        document.querySelector(".faq-section").appendChild(newItem);

        faqForm.querySelector("textarea").value = "";

        alert("Your question was submitted successfully!");

        var newQuestion = newItem.querySelector("h4");
        var newAnswer = newItem.querySelector("p");
        newAnswer.style.display = "none";

        newQuestion.onclick = function () {
            if (newAnswer.style.display === "none") {
                newAnswer.style.display = "block";
            } else {
                newAnswer.style.display = "none";
            }
        };
    };
}

};

