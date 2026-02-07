# Custom QR Code Generator 

A Node.js application that creates a customized QR code with optional decorative frame, multiple color choices, and option for a center image overlayed on top of the QR code. 

## Features 
- **URL Validation**: ensures that a valid HTTP/HTTPs url is provided 
- **Custom Color Schemes**: Choose from preset themes (Teal, Ocean Blue, Purple Sunset, Classic Black and White) or there is the option to input your own custom colors 
- **Decorative Frame Options**: Multiple shape options including
- Circle
- Hexagon
- Octagon
- Scalloped Circle (Badge)
- 8-Pointed Star
- Flower/Petal
- Rounded Square
- Cloud
- **Center Image Overlayed on top of Code**: Add a custom image like a logo, profile picture, or any other image to the center of the QR code 
- **Error Correction**: QR code still remains scannable and useable even with image overlays and added frames 


Follow the interactive prompts to: 
1. Enter your URL
2. Name your output file
3. Choose whether to add a center image, and provide file path to center image if so desired 
4. Select a color scheme and input custom colors if desired 
5. Pick a decorative frame shape 

The generator will create: 
- A PNG image of your custom QR code made according to your specifications
- A text file containing the URL

