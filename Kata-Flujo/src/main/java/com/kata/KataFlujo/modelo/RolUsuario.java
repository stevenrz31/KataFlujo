package com.kata.KataFlujo.modelo;

public enum RolUsuario {
    SOLICITANTE("Solicitante"),
    APROBADOR("Aprobador"), 
    ADMINISTRADOR("Administrador");
    
    private final String nombreVisible;
    
    RolUsuario(String nombreVisible) {
        this.nombreVisible = nombreVisible;
    }
    
    public String getNombreVisible() {
        return nombreVisible;
    }
}
