---
layout: page
title: Posts
permalink: /posts/
---

<style>
.constrainwidth{
    max-width:900px;
}
</style>


<div class="constrainwidth">
    <h2>All Posts Grouped by Tag</h2>
    {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
    {% for tag in site.tags %}
    <h3>{{ tag[0] }}</h3>
    <ul>
        {% for post in tag[1] %}
        
            <ul class="post-list">

            <h4 style="margin: 0px;">
                <a style="text-align: left;" class="post-link" href="{{ post.url | relative_url }}">
                    {{ post.title | escape }}
                </a>
                <div style="display: flex; flex-direction:row; margin:auto;">
                    <span class="post-meta post-meta-tags">Tags:

                        {% for tag in post.tags %}
                        {{ tag }}

                        {% endfor %}

                    </span>
                    <span class="post-meta post-meta-date">{{ post.date | date: date_format
                        }}</span>
                </div>
            </h4>
            {%- if site.show_excerpts -%}
            {{ post.excerpt }}
            {%- endif -%}
        </ul>


        {% endfor %}
    </ul>
    {% endfor %}
</div>