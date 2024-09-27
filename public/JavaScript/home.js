window.onload = function() {
    templateUserName()
    getCookie()
    budget()
};
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
  }
  return "";
}

   function templateUserName() {
    const myHeaders = new Headers();
    myHeaders.append("x-auth-token", getCookie("token"));
    myHeaders.append("Content-Type", "application/json");
    console.log("Token", getCookie("token"))
     // Fetch user data using the token in the header
     fetch("http://52.158.43.53:8080/api/users/info", {
        headers: myHeaders
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return response.json(); // Parse response body as JSON
    })
    .then((data) => {
        document.getElementById("username").textContent = data.name
    })
    .catch((error) => console.error(error));
   }
   function budget(){
    const openModalBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('inputModal');
const closeBtn = document.getElementsByClassName('close')[0];
const userInput = document.getElementById('userInput');
const submitBtn = document.getElementById('submitBtn');
const errorText = document.getElementById('errorText');
// Open the modal when the button is clicked
openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Close the modal when the close button (x) is clicked
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close the modal when the user clicks anywhere outside the modal
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});
// Validate input and submit
submitBtn.addEventListener('click', () => {
    const inputValue = userInput.value;
    // Check if input is a valid integer
    if (Number(inputValue)) {
        // Input is an integer
        // You can handle the submission logic here
        console.log("Submitted value:", inputValue);
        const myHeaders = new Headers();
        myHeaders.append("x-auth-token", getCookie("token"));
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
        "cardNumber": 8978384915241121,
        "limit": inputValue
        });

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
        };
            const getRequestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
            };
        
        fetch("http://52.158.43.53:8080/api/users/info", getRequestOptions)
        .then((response) => response.text())
        .then((data) => {
            const newRaw = JSON.stringify({
                "cardNumber": data.card,
                "limit": inputValue
            });
            requestOptions.body = newRaw;
        })
        .catch((error) => console.error(error));

        fetch("http://52.158.43.53:8080/api/balance/budget", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
        // Clear error message if any
        errorText.textContent = '';
        // Close the modal
        modal.style.display = 'none';
    } else {
        // Input is not an integer
        // Display error message
        errorText.textContent = 'Please enter a valid number.';
    }
});
   }