# Cycle2 - 2nd Generation Cycling!

## Getting Started
Download either the [production version][min] or the [development version][max] of Cycle2.

[min]: build/jquery.cycle2.min.js
[max]: build/jquery.cycle2.js

In your web page:

<pre>
&lt;!-- include jQuery -->
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js">&lt;/script>
&lt;!-- include Cycle2 -->
&lt;script src="http://path/to/your/copy/of/jquery.cycle2.min.js">&lt;/script>

...

&lt;!-- declare a slideshow -->
&lt;div class="<strong>cycle-slideshow</strong>">
    &lt;img src="http://malsup.github.com/images/p1.jpg">
    &lt;img src="http://malsup.github.com/images/p2.jpg">
    &lt;img src="http://malsup.github.com/images/p3.jpg">
&lt;/div>
</pre>
That's it!  You don't need to write any script to initialize the slideshow, Cycle2 will auto-initialize if you use the class <code>cycle-slideshow</code>.


This version of jquery cycle allows one to embed multiple slideshows with navigations on the page, without requiring custom JS to be written for each slideshow. The code below will render a slideshow and the navigation within the `slideshow__container` that applies only to that specific slideshow, no matter how many times it is inserted on the page.

```
<div class="slideshow__container">
  <div class="slideshow cycle-slideshow" data-cycle-slides="> .slide" data-cycle-pager=".slideshow__navigation">
    <div class="slide"></div>
    <div class="slide"></div>
  </div>
  <div class="slideshow__navigation">
    <span class="slideshow__prev"></span>
    <span class="slideshow__next"></span>
  </div>
</div>
```


## Documentation, Demos, Downloads and FAQ
Everything you need to know can be found here:
[http://jquery.malsup.com/cycle2/](http://jquery.malsup.com/cycle2/)

## Bower
To install Cycle2 via Bower:
<pre>bower install jquery-cycle2-patched</pre>
The only file you will need (unless you're customizing) is <code>build/jquery.cycle2.min.js</code>

(Other files are available for advanced customization and you can read more about them on the [download]
and [advanced download][advanced] pages.)

[download]: http://jquery.malsup.com/cycle2/download/
[advanced]: http://jquery.malsup.com/cycle2/download/advanced.php


## Build
If you want to make changes to Cycle2 and build it yourself, you can do so by installing the node build dependencies:
<pre>npm install</pre>
and then running grunt
<pre>grunt</pre>

## Copyright and License
Copyright &copy; 2012-2014 M. Alsup.

The Cycle2 plugin is dual licensed under the [MIT](http://malsup.github.com/mit-license.txt) and [GPL](http://malsup.github.com/gpl-license-v2.txt) licenses.

You may use either license.  The MIT license is recommended for most projects because it is simple and easy to understand and it places almost no restrictions on what you can do with the plugin.

If the GPL suits your project better you are also free to use the plugin under that license.

You do not have to do anything special to choose one license or the other and you don't have to notify anyone which license you are using. You are free to use the Cycle2 plugin in commercial projects as long as the copyright header is left intact.
