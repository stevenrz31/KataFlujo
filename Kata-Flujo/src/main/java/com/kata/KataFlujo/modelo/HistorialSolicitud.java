package com.kata.KataFlujo.modelo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_solicitudes")
public class HistorialSolicitud {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "solicitud_id", nullable = false)
    private String solicitudId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_anterior")
    private EstadoSolicitud estadoAnterior;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_nuevo", nullable = false)
    private EstadoSolicitud estadoNuevo;
    
    @Column(name = "accion_por", nullable = false)
    private Long accionPor;
    
    @Column(columnDefinition = "TEXT")
    private String comentarios;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    // Constructor
    public HistorialSolicitud() {}
    
    public HistorialSolicitud(String solicitudId, EstadoSolicitud estadoAnterior, EstadoSolicitud estadoNuevo, Long accionPor, String comentarios) {
        this.solicitudId = solicitudId;
        this.estadoAnterior = estadoAnterior;
        this.estadoNuevo = estadoNuevo;
        this.accionPor = accionPor;
        this.comentarios = comentarios;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSolicitudId() { return solicitudId; }
    public void setSolicitudId(String solicitudId) { this.solicitudId = solicitudId; }
    
    public EstadoSolicitud getEstadoAnterior() { return estadoAnterior; }
    public void setEstadoAnterior(EstadoSolicitud estadoAnterior) { this.estadoAnterior = estadoAnterior; }
    
    public EstadoSolicitud getEstadoNuevo() { return estadoNuevo; }
    public void setEstadoNuevo(EstadoSolicitud estadoNuevo) { this.estadoNuevo = estadoNuevo; }
    
    public Long getAccionPor() { return accionPor; }
    public void setAccionPor(Long accionPor) { this.accionPor = accionPor; }
    
    public String getComentarios() { return comentarios; }
    public void setComentarios(String comentarios) { this.comentarios = comentarios; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
