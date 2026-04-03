## Creating a Vertical Toolbar
 
### Prompt
Create a shadcn button group for me that acts as a toolbar for a whiteboard. It should have a pen button, eraser button, and clear button. The pen button when clicked should pop out a dropdown with various colours
 
### AI Response
 
<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/c33f16cc-d932-465c-bef6-f983ed7be777" />
<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/28abcb75-5a84-46c9-9913-bbfe6961a371" />
 
### What Your Team Did With It
- The AI was incorrect when trying to show how to create a vertical toolbar.Shadcn/ui's Menubar component is not made to be oriented vertically.
- We were able to verify this because there are other shadcn/ui components that support an "orientation" prop to allow the components to rotate. The Menubar, however, does not support this prop and the way the ai implemented the Menubar did not make sense. The AI did not end up being useful and as such we decided not to use it going further.
- We ended up replacing the AI's response with an HTML <header> tag and made the toolbar horizontal instead of vertical.
