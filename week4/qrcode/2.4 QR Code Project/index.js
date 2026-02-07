/* 
April Hope Torres
ICS 385 Spring 2026
QR Code Project - Custom QR Code Generator

This Node.js application generates a custom QR code based on user input. It prompts the user for a URL, output filename, optional center image, color scheme, and decorative frame shape. The application uses the 'qrcode' library to create the QR code and 'jimp' for image manipulation to add frames and center images. The final QR code is saved as a PNG file, and the URL is saved to a text file for reference.

Claude AI was used to help generate the code for this project. 
*/

import inquirer from "inquirer";
import QRCode from "qrcode";
import Jimp from "jimp";
import fs from "fs";

// Claude-generated Code: URL validation function added
// April's interpretation: This checks to make sure that the URL entered is actualy valid, and that it starts with http:// or https://. If it's not valid, the program will prompt the user to enter a valid URL. This makes sure there aren't errors later when trying to create the QR code. 
function isValidURL(string) {
    try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
        return false;
    }
}

// Claude-generated Code: Main function that orchestrates the entire QR code generation process
// April's interpretation: This is the main function of the whole program. It's what starts all the prompting! 
async function generateCustomQR() {
    console.log("🎨 Welcome to the Custom QR Code Generator! 🎨\n");

    // Claude-generated Code: Step 1 - Prompts user for URL, filename, optional center image, color scheme, and frame shape
    // April's interpretation: These are the questions that get asked during the QR code creation. 
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "url",
            message: "Enter the URL for your QR code:",
            validate: (input) => {
                if (isValidURL(input)) {
                    return true;
                }
                return "Please enter a valid URL (it must start with http:// or https://)";
            }
        },
        {
            type: "input",
            name: "filename",
            message: "What should we name the output file? (without extension)",
            default: "custom_qr"
        },
        {
            type: "confirm",
            name: "useImage",
            message: "Would you like to add a center image?",
            default: true
        },
        {
            type: "input",
            name: "imagePath",
            message: "Enter the path to your center image:",
            when: (answers) => answers.useImage,
            validate: (input) => {
                if (fs.existsSync(input)) {
                    return true;
                }
                return "File not found. Please enter a valid file path.";
            }
        },
        {
            type: "list",
            name: "colorScheme",
            message: "Choose your color scheme:",
            choices: [
                { name: "Teal Gradient", value: "teal" },
                { name: "Ocean Blue", value: "ocean" },
                { name: "Purple Sunset", value: "purple" },
                { name: "Classic Black & White", value: "classic" },
                { name: "Custom Colors", value: "custom" }
            ],
            default: "teal"
        },
        // Claude helped me do this, I wanted to add the option to have a decorative frame around the QR code. I added a bunch of different shapes to choose from, or the option to have no frame at all and just the traditional square shape. 
        {
            type: "list",
            name: "frameShape",
            message: "Choose a decorative frame shape:",
            choices: [
                { name: "Circle", value: "circle" },
                { name: "Hexagon", value: "hexagon" },
                { name: "Octagon", value: "octagon" },
                { name: "Scalloped Circle (Badge)", value: "scalloped" },
                { name: "8-Pointed Star", value: "star8" },
                { name: "Flower/Petal", value: "flower" },
                { name: "Rounded Square", value: "rounded" },
                { name: "Cloud", value: "cloud" },
                { name: "No Frame (just QR code)", value: "none" }
            ],
            default: "circle"
        }
    ]);

    // Claude-generated Code: Define color schemes BEFORE using them - stores predefined color combinations
    // April's interpretation: These are all different color schemes the user can pick from so the QR code isn't just black and white. the custom option lets a user input their own hex codes for colors. 
    const colorSchemes = {
        teal: { dark: "#008B8B", light: "#E0F7F7" },
        ocean: { dark: "#006994", light: "#E6F3F9" },
        purple: { dark: "#6A0DAD", light: "#F3E5F5" },
        classic: { dark: "#000000", light: "#FFFFFF" }
    };

    let qrColors = colorSchemes[answers.colorScheme] || colorSchemes.teal;

    // Claude-generated Code: If custom colors, ask for hex codes for dark modules and light background
    // April's interpretation: further prompting if the custom color option is chosen. 
    if (answers.colorScheme === "custom") {
        const customColors = await inquirer.prompt([
            {
                type: "input",
                name: "dark",
                message: "Enter hex code for dark modules (e.g., #008B8B):",
                default: "#000000"
            },
            {
                type: "input",
                name: "light",
                message: "Enter hex code for light background (e.g., #E0F7F7):",
                default: "#FFFFFF"
            }
        ]);
        qrColors = customColors;
    }

    // Claude-generated Code: User feedback message indicating QR code generation has started
    // April's interpretation: this just lets the user know that the QR code is being generated 
    console.log("\n⏳ Generating your custom QR code...\n");

    // Claude-generated Code: Step 2 - Generate QR code as a PNG buffer with custom colors and high error correction
    // April's interpretation: The claude code pretty much sums it up
    const qrOptions = {
        errorCorrectionLevel: "H", // Highest error correction for image overlay
        type: "image/png",
        quality: 1,
        margin: 1,
        width: 800,
        color: {
            dark: qrColors.dark,
            light: qrColors.light
        }
    };

    // Claude-generated Code: Convert QR code to a PNG buffer using the specified options
    // April's interpretation: From my understanding, this will store the QR code so the frame and center image can be added to it before the final image is saved. 
    const qrBuffer = await QRCode.toBuffer(answers.url, qrOptions);

    // Claude-generated Code: Step 3 - Create decorative frame based on user selection and add center image if requested
    // April's interpretation: This is the frame and center image being added to the QR code. 
    let finalImage;

    // Claude-generated Code: Check if user selected a decorative frame (if not "none", create a frame)
    // April's interpretation: The frame shape is added to the QR code here. 
    if (answers.frameShape !== "none") {
        // Claude-generated Code: Create a larger canvas for the frame with padding around the QR code
        // April's interpretation: This makes the frame bigger than the QR code so it can be seen around the edges of the QR code. The const padding centers the QR code within the frame. 
        const frameSize = 1000;
        const qrSize = 700;
        const padding = (frameSize - qrSize) / 2;

        // Claude-generated Code: Load the QR code buffer into a Jimp image object for manipulation
        // April's interpretation: This is where Jimp actually loads the QR code so it can be put onto the frame and have the center image added. 
        const qrImage = await Jimp.read(qrBuffer);
        qrImage.resize(qrSize, qrSize);

        // Claude-generated Code: Create background canvas with the light color from the selected color scheme
        // April's interpretation: Claude pretty much summed it up
        finalImage = new Jimp(frameSize, frameSize, qrColors.light);

        // Claude-generated Code: Create the shape based on user's frame shape selection
        // April's interpretation: nothing to add 
        if (answers.frameShape === "circle") {
            // Claude-generated Code: Apply circular shape to the frame canvas
            // April's interpretation: nothing to add 
            finalImage.circle();
        } else if (answers.frameShape === "rounded") {
            // Claude-generated Code: Create a rounded square frame by applying a mask with rounded corners
            // April's interpretation: nothing to add 
            const mask = new Jimp(frameSize, frameSize, 0xFFFFFFFF);
            const cornerRadius = 100;

            // Claude-generated Code: Iterate through each pixel to create rounded rectangle effect by making corner pixels transparent
            // April's interpretation: that was a fancy claude way of saying that this makes the corners look rounded. 
            mask.scan(0, 0, mask.bitmap.width, mask.bitmap.height, function (x, y, idx) {
                const distX = Math.min(x, mask.bitmap.width - x);
                const distY = Math.min(y, mask.bitmap.height - y);

                // Claude-generated Code: Check if pixel is in corner area and calculate distance from corner
                // April's interpretation: more fancy math to make the corners look rounded.
                if (distX < cornerRadius && distY < cornerRadius) {
                    const dx = cornerRadius - distX;
                    const dy = cornerRadius - distY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Claude-generated Code: If pixel is outside the rounded corner arc, make it transparent
                    // April's interpretation: nothing to add 
                    if (distance > cornerRadius) {
                        this.bitmap.data[idx + 3] = 0;
                    }
                }
            });

            finalImage.mask(mask, 0, 0);
        } else if (answers.frameShape === "cloud") {
            // Claude-generated Code: Create a simple cloud shape by compositing multiple circles together
            // April's interpretation: nothing to add 
            finalImage = new Jimp(frameSize, frameSize, 0x00000000);

            // Claude-generated Code: Convert hex color string to integer format that Jimp can use
            // April's interpretation: nothing to add 
            const lightColor = parseInt(qrColors.light.replace('#', '0x') + 'FF', 16);

            // Claude-generated Code: Create main body of cloud as large circle
            // April's interpretation: nothing to add 
            const mainCircle = new Jimp(frameSize * 0.7, frameSize * 0.7, lightColor);
            mainCircle.circle();
            finalImage.composite(mainCircle, frameSize * 0.15, frameSize * 0.2);

            // Claude-generated Code: Create top left puff of cloud
            // April's interpretation: nothing to add 
            const puff1 = new Jimp(frameSize * 0.4, frameSize * 0.4, lightColor);
            puff1.circle();
            finalImage.composite(puff1, frameSize * 0.05, frameSize * 0.15);

            // Claude-generated Code: Create top right puff of cloud
            // April's interpretation: nothing to add 
            const puff2 = new Jimp(frameSize * 0.35, frameSize * 0.35, lightColor);
            puff2.circle();
            finalImage.composite(puff2, frameSize * 0.6, frameSize * 0.1);

            // Claude-generated Code: Create top middle puff of cloud
            // April's interpretation: these have all been adding "puffs" to make a cloud shape 
            const puff3 = new Jimp(frameSize * 0.3, frameSize * 0.3, lightColor);
            puff3.circle();
            finalImage.composite(puff3, frameSize * 0.35, frameSize * 0.05);
        }

        // Claude-generated Code: Composite the QR code image into the center of the decorative frame
        // April's interpretation: nothing to add 
        finalImage.composite(qrImage, padding, padding);

    } else {
        // Claude-generated Code: If no frame selected, load the QR code directly as the final image
        // April's interpretation: nothing to add 
        finalImage = await Jimp.read(qrBuffer);
    }

    // Claude-generated Code: Add center image overlay if the user requested one
    // April's interpretation: This is where the center image gets added if the user decided to add one. 
    if (answers.useImage) {
        try {
            // Claude-generated Code: Load the center image from user-provided file path
            // April's interpretation: nothing to add 
            const centerImage = await Jimp.read(answers.imagePath);

            // Claude-generated Code: Resize center image to 15% of final image size
            // April's interpretation: this resizes the center image so it's not so big that it covers up too much of the qr code 
            const centerSize = Math.floor(finalImage.bitmap.width * 0.15);
            centerImage.resize(centerSize, centerSize);

            // Claude-generated Code: Apply circular shape to the center image for a polished look
            // April's interpretation: Makes the center image circular 
            centerImage.circle();

            // Claude-generated Code: Calculate the x and y coordinates to center the image on the final image
            // April's interpretation: this math centers the center image on the qr code, ensuring it both looks nice and doesn't cover up any of the code itself. 
            const x = Math.floor((finalImage.bitmap.width - centerSize) / 2);
            const y = Math.floor((finalImage.bitmap.height - centerSize) / 2);

            // Claude-generated Code: Overlay the circular center image onto the final QR code image
            // April's interpretation: this is where the image actually gets added 
            finalImage.composite(centerImage, x, y);

        } catch (error) {
            // Claude-generated Code: Catch and log any errors that occur when trying to add the center image
            // April's interpretation: this is where errors get logged. this will help prevent the whole program from crashing if there's a problem with the center image. 
            console.error("Error adding center image:", error.message);
        }
    }

    // Claude-generated Code: Save the final composite image as a PNG file
    // April's interpretation: this is where the final image gets saved using the filename provided by the user earlier on. 
    await finalImage.writeAsync(`${answers.filename}.png`);

    // Claude-generated Code: Step 4 - Save the URL to a text file for future reference
    // April's interpretation: this creates a text file that shows the url that the qr code links to, just in case the user needs to reference it later
    fs.writeFileSync(`${answers.filename}_url.txt`, answers.url);

    // Claude-generated Code: Display success message with file locations
    // April's interpretation: this displays a success message if the creation has happened succesfully! 
    console.log(`✨ Success! Your QR code has been created:`);
    console.log(`   📷 Image: ${answers.filename}.png`);
    console.log(`   📝 URL saved to: ${answers.filename}_url.txt`);
    console.log(`\n🎯 Scan the QR code to test it!\n`);
}

// Claude-generated Code: Execute the main function and catch any errors
// April's interpretation: this runs the whole program and logs any errors that happened during the process. 
generateCustomQR().catch(console.error);