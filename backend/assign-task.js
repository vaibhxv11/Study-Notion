const { Suprsend } = require("@suprsend/node-sdk");

const supr_client = new Suprsend(
    "ccg8ttIrOFBQ3hX6CSZU", // Your workspace key
    "SS.WSS.EybbGg4MTCoB8RYoZ-omD7MdgNa0rt926GDw-hpU" // Your workspace secret
);

async function triggerEvent() {
    try {
        const response = await supr_client.track(
            "balasodudhal775@gmail.com",
            "VAIBHAV",
            {
                user: 'VAibhav'
            }
        );
        console.log("Response:", response);
    } catch (error) {
        console.error("Error triggering event:", error);
    }
}

module.exports={triggerEvent}
