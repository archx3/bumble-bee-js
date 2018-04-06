Widget provides the foundation class on which all Bee Widgets will be built.
It is designed to be extended to create widgets which address specific user interaction patterns.

It adds the following core functionality:

Basic Attributes
It introduces a common set of attributes that will be available on any widget. For example, boundingBox, contentBox, width, height, visible, focused and disabled.
Render Lifecycle Phase

It adds the render lifecycle method (and event) to the init and destroy lifecycle methods provided by Base.
Abstract Rendering Methods
It establishes abstract methods renderUI, bindUI and syncUI to provide consistent entry points for rendering across all widgets.
Consistent Progressive Enhancement
It provides a common entry point for Progressive Enhancement during widget initialization and also provides the infrastructure to hide progressively enhanced markup to avoid flashes of unstyled content.
String Localization
The strings attribute provides a consistent API for string management in all Widgets. Widget developers can define strings for their widget in an external language bundle when packaging their widgets as a YUI module, and use the Internationalization utility to pull in strings for a given locale as demonstrated in the Language Resource Bundles example.