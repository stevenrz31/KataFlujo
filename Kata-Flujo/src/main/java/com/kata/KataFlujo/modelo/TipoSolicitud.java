package com.kata.KataFlujo.modelo;

public enum TipoSolicitud {
    DESPLIEGUE("Despliegue"),
    ACCESO("Acceso a Herramientas"),
    CAMBIO_TECNICO("Cambio Técnico"),
    CAMBIO_PIPELINE("Cambio en Pipeline"),
    INCORPORACION_HERRAMIENTA("Incorporación de Herramienta");
    
    private final String nombreVisible;
    
    TipoSolicitud(String nombreVisible) {
        this.nombreVisible = nombreVisible;
    }
    
    public String getNombreVisible() {
        return nombreVisible;
    }
    
    public static TipoSolicitud[] obtenerTodos() {
        return values();
    }
}