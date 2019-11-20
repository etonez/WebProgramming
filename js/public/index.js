//if username textbox is filled with username when clicked, empty the textbox
function field_focus(field, username)
{
  if(field.value == username)
  {
    field.value = '';
  }
}

//if the username textbox is empty, fill it with username 
function field_blur(field, username)
{
  if(field.value == '')
  {
    field.value = username;
  }
}


//when the button is pressed do this
('a').click(function(event){
  event.preventDefault(); 
  });