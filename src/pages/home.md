---
layout: layouts/home.njk
title: Home
date: 2016-01-01T00:00:00.000Z
permalink: /
---

<ul class="la-liste">
{% for post in collections.posts | reverse %}
  <li class="une-entree">
    <time class="quel-jour" datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate }}</time>

    <h2>
      <a class="le-chemin" href="{{ post.url | url }}">{{ post.data.title }}</a>
    </h2>

    <article class="mise-en-bouche">{% excerpt post %}</article>
  </li>
{% endfor %}
</ul>
