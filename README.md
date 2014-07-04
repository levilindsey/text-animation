# text-animation

#### Character-by-character animation of text

_THIS PROJECT IN A WORK IN PROGRESS_

### The In-Order Animation Algorithm

  1. Iterate through each descendant node in the root element's DOM structure

    a. This uses a pre-order tree traversal
    
    b. Store the text of each text node along with the parent element associated with the text node
    
    c. Fix each descendant element with its original dimensions
    
    d. Empty out all text nodes
    
    e. Remove each descendant node from the DOM

  2. Iterate through each character and animate them

    a. This is now a simple linear iteration, because we flattened the DOM structure in our 
       earlier traversal
       
    b. Animate the character

      1. Add the character to a span
      2. Insert the span into the character's parent element
      3. If the parent element was not yet re-inserted into the DOM, then re-insert it
      4. Run the actual animation of the isolated character

    c. Finish animating the character

      1. Remove the span
      2. Concatenate the original character back into the parent element's text node

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
    H:TextNode      <p>:Element      Y:TextNode      <div>:Element      !:TextNode
                         |                  _______________|_______________
                     e:TextNode            /               |               \
                                      D:TextNode      <p>:Element      M:TextNode
                                                           |
                                                       O:TextNode

#### JavaScript Object Structure

    [
      {"parentElement": <body>, "text": "H"},
      {"parentElement": <p>,    "text": "e"},
      {"parentElement": <body>, "text": "y"},
      {"parentElement": <div>,  "text": "D"},
      {"parentElement": <p>,    "text": "O"},
      {"parentElement": <div>,  "text": "M"},
      {"parentElement": <body>, "text": "!"}
    ]

======

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=levisl176&url=github.com/levisl176/text-animation&title=text-animation&language=javascript&tags=github&category=software)
