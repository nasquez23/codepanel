package com.codepanel.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class SocialLinks {
    @Column(name = "github_url")
    private String github;

    @Column(name = "linkedin_url")
    private String linkedin;

    @Column(name = "twitter_url")
    private String twitter;

    @Column(name = "website_url")
    private String website;
}
