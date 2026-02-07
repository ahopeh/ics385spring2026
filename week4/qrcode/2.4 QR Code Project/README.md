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

## Testing

### Test Cases Performed: 
1. **URL Validation Test**
    -Input an invalid URL without correct protocols
    -Expected: Error message requiring http:// or https://
    -Result: Pass - url validation worked as expected 

2. **Teal Color Scheme Test**
    -Input chosen teal color gradient
    -Expected: QR code produced that looks teal in color
    -Result: Pass - colors were applied successfully 

3. **Circular Frame Test**
    -Input: selected circular frame shape 
    -Expected: QR code with round frame around it 
    -Result: Pass - frame appeared as expected 

4. **Center Image Overlay Test**
    -Input: provided a moon image for overlay
    -Expected: QR code with moon image at the center, but QR code is still scannable
    -Result: Pass - image was there and QR code still worked as expected 


## What I Learned

This assignment gave me hands on experience with Node.js package management, image manipulation, creating an interactive CLI command-line interface, and a deeper understanding of QR code technology. 
AI assisted in writing the code, facilitating a more complex design and ensuring error correcting was handled appropriately. 

## Key Improvements

-Added URL validation
-Added 9 frame shape options to choose from 
-Created 5 preset color scheme choices and provided custom color option
-Integrated customizable center image 
-Enhanced user experience with interactive CLI prompts. 