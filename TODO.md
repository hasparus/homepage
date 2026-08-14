The images in the post don't take space while they load. We should `import` them
to the MDX post and pass their imported `src` object to the ChatConversation so
we have their width and height. Maybe also use Image.astro?

---

When below the second card (original) the conversation card should be translated
left like 20px and the interaction should be on the whole group (i.e. hovering
the old card should still show the hover state on the new card). I'm pretty sure
this is simple to do surgically without changing much of existing code
/ponytail.
