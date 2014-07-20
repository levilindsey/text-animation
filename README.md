# text-animation

#### Character-by-character animation of text

_See this running at [www.jackieandlevi.com/text-animation](http://www.jackieandlevi.com/text-animation)!_

_...or at [http://codepen.io/levisl176/full/HGJdF](http://codepen.io/levisl176/full/HGJdF)!_

This text-animation module makes it easy to animate the text of any collection of HTML elements. 
With this module, each character animates individually, and it is simple to customize this 
character animation.

===============================
### Running the example locally

#### Install

You will need to install the following on your system:

  - [Git](http://git-scm.com/downloads)
  - [Node.js](http://nodejs.org/download/)

#### Fetch code from GitLab

Within a console, run `git clone https://gitlab.idean.com/idean-labs/labs.git`.

#### NPM

I use NPM to manage the server-side packages that the example app depends on.

In order to install these packages, within a console, navigate to the project directory and run 
`npm install`.

#### Run the Server

Within a console, navigate to the text-animation project directory and run `npm start`.

#### Open the page

Open a browser and navigate to [localhost:3000](localhost:3000).

====================================
### The In-Order Animation Algorithm

  1. Iterate through each descendant node in the root element's DOM structure

    a. This uses a pre-order tree traversal
    
    b. Store the text of each text node along with the parent element and next sibling node 
       associated with the text node
    
    c. Fix each descendant element with its original dimensions
    
    d. Empty out all text nodes

  2. Iterate through each character and animate them

    a. This is now a simple linear iteration, because we flattened the DOM structure in our 
       earlier traversal
       
    b. Animate the character

      1. Add the character to a span
      2. Insert the span into the character's parent element
      
        a. If the original text node has a next sibling node, then insert this span before that node
        
        b. Otherwise, append this node to the end of the original text node's parent node
      
      4. Run the actual animation of the isolated character

    c. Finish animating the character

      1. Remove the span
      2. Concatenate the character back into the original text node

The following three representations of the same DOM structure may help to understand 
how this algorithm flattens and stores the DOM representation.

#### Original HTML Representation

    <body>
      H
      <p>
        e
      </p>
      y
      <div>
        D
        <p>
          O
        </p>
        M
      </div>
      !
    </body>

#### Visual Tree Representation

                                   <body>:Element
          ________________________________|________________________________
         /                /               |               \                \
    H:TextNode      <p>:Element      y:TextNode      <div>:Element      !:TextNode
                         |                  _______________|_______________
                     e:TextNode            /               |               \
                                      D:TextNode      <p>:Element      M:TextNode
                                                           |
                                                       O:TextNode

#### JavaScript Object Structure of Text Nodes

    [
      {"parentElement": <body>, "nextSiblingNode": <p>, "text": "H"},
      {"parentElement": <p>,    "nextSiblingNode": null, "text": "e"},
      {"parentElement": <body>, "nextSiblingNode": <div>, "text": "y"},
      {"parentElement": <div>,  "nextSiblingNode": <p>, "text": "D"},
      {"parentElement": <p>,    "nextSiblingNode": null, "text": "O"},
      {"parentElement": <div>,  "nextSiblingNode": null, "text": "M"},
      {"parentElement": <body>, "nextSiblingNode": null, "text": "!"}
    ]

======

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=levisl176&url=github.com/levisl176/text-animation&title=text-animation&language=javascript&tags=github&category=software)
