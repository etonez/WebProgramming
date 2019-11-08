import tkinter as tk
root = tk.Tk()
sq_size = 60

m = []
d = {}
layers = {0:"#cdcdcd", #gray
          1:"#0021ff", #blue
          2:"#fff100", #yellow
          3:"#ff0000", #red
          4:"#747474"} #dark gray
          
current_colour = 0
def set_current_colour(c):
    global current_colour
    current_colour = c
    
def colchange(self):
    col = self.cget("bg")
    global current_colour
    self.setbg(current_colour)

class square(tk.Canvas):    
    def __init__(self,x,y,ID):
        super().__init__(root,height=12,
                           width=12,bg="#cdcdcd")
        tk.Canvas.grid(self,row=x,column=y)
        self.config(bd=0,highlightthickness=0, relief='ridge')
        self.bind("<Enter>", (lambda event: colchange(self)))
        self.backg = self.cget("bg")
        backg_c = 0
    def setbg(self,col):
        self.config(bg=layers[col])
        self.backg=layers[col]
        current_colour = col


def p(d):
    for i in range(len(d)):
        col = d[i].backg
        for x in range(len(layers)):
            if col == layers[x]:
                print(x, end=", ")      
        
for x in range(sq_size):
    for y in range(sq_size):
        ID = (x*sq_size)+y
        d[ID] = square(x,y,ID)
        this_o = d[ID]

outb = tk.Button(root,text="output",command = (lambda : p(d)))
outb.grid(row=61,column=61)

but_1 = tk.Button(root,text="light gray",command = (lambda : set_current_colour(0)))
but_1.grid(row=61,column = 0, columnspan = 10)

but_2 = tk.Button(root,text="blue",command = (lambda : set_current_colour(1)))
but_2.grid(row=61,column=11,columnspan = 10)

but_2 = tk.Button(root,text="yellow",command = (lambda : set_current_colour(2)))
but_2.grid(row=61,column=21,columnspan = 10)

but_2 = tk.Button(root,text="red",command = (lambda : set_current_colour(3)))
but_2.grid(row=61,column=31,columnspan = 10)

but_2 = tk.Button(root,text="dark gray",command = (lambda : set_current_colour(4)))
but_2.grid(row=61,column=41,columnspan = 10)
