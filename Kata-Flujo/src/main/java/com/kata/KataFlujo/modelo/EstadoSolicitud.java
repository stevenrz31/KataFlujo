package com.kata.KataFlujo.modelo;

public enum EstadoSolicitud {
    PENDIENTE("Pendiente"),
    APROBADA("Aprobada"),
    RECHAZADA("Rechazada");
    
    private final String nombreVisible;
    
    EstadoSolicitud(String nombreVisible) {
        this.nombreVisible = nombreVisible;
    }
    
    public String getNombreVisible() {
        return nombreVisible;
    }
}