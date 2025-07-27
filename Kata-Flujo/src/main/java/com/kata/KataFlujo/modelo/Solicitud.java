package com.kata.KataFlujo.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "solicitudes")
public class Solicitud {
    
    @Id
    private String id;
    
    @NotBlank(message = "El título es requerido")
    @Column(nullable = false, length = 200)
    private String titulo;
    
    @NotBlank(message = "La descripción es requerida")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;
    
    @NotNull(message = "El solicitante es requerido")
    @Column(name = "solicitante_id", nullable = false)
    private Long solicitanteId;
    
    @NotNull(message = "El aprobador es requerido")
    @Column(name = "aprobador_id", nullable = false)
    private Long aprobadorId;
    
    @NotBlank(message = "El tipo de solicitud es requerido")
    @Column(name = "tipo_solicitud", nullable = false, length = 50)
    private String tipoSolicitud;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;
    
    @Column(columnDefinition = "TEXT")
    private String comentarios;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion = LocalDateTime.now();
    
    // Relaciones para obtener datos completos
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitante_id", insertable = false, updatable = false)
    private Usuario solicitante;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprobador_id", insertable = false, updatable = false)
    private Usuario aprobador;
    
    // Constructores
    public Solicitud() {
        this.id = UUID.randomUUID().toString();
    }
    
    public Solicitud(String titulo, String descripcion, Long solicitanteId, Long aprobadorId, String tipoSolicitud) {
        this();
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.solicitanteId = solicitanteId;
        this.aprobadorId = aprobadorId;
        this.tipoSolicitud = tipoSolicitud;
    }
    
    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public Long getSolicitanteId() { return solicitanteId; }
    public void setSolicitanteId(Long solicitanteId) { this.solicitanteId = solicitanteId; }
    
    public Long getAprobadorId() { return aprobadorId; }
    public void setAprobadorId(Long aprobadorId) { this.aprobadorId = aprobadorId; }
    
    public String getTipoSolicitud() { return tipoSolicitud; }
    public void setTipoSolicitud(String tipoSolicitud) { this.tipoSolicitud = tipoSolicitud; }
    
    public EstadoSolicitud getEstado() { return estado; }
    public void setEstado(EstadoSolicitud estado) { 
        this.estado = estado;
        this.fechaActualizacion = LocalDateTime.now();
    }
    
    public String getComentarios() { return comentarios; }
    public void setComentarios(String comentarios) { this.comentarios = comentarios; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    
    public Usuario getSolicitante() { return solicitante; }
    public void setSolicitante(Usuario solicitante) { this.solicitante = solicitante; }
    
    public Usuario getAprobador() { return aprobador; }
    public void setAprobador(Usuario aprobador) { this.aprobador = aprobador; }
}