package com.codepanel.models.enums;

public enum ProgrammingLanguage {
    JAVA("Java"),
    JAVASCRIPT("JavaScript"),
    PYTHON("Python"),
    TYPESCRIPT("TypeScript"),
    C("C"),
    CPP("C++"),
    CSHARP("C#"),
    PHP("PHP");

    private final String displayName;

    ProgrammingLanguage(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
