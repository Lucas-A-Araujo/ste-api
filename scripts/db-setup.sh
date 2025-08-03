#!/bin/bash

echo "🚀 Configurando banco de dados PostgreSQL..."

# Verificar se já existe um PostgreSQL rodando na porta 5432
if docker ps | grep -q ":5432->5432/tcp"; then
    echo "✅ PostgreSQL já está rodando na porta 5432!"
    echo "📊 Usando container existente..."
    
    # Mostrar informações do container existente
    EXISTING_CONTAINER=$(docker ps --format "table {{.Names}}\t{{.Ports}}" | grep ":5432->5432/tcp" | awk '{print $1}')
    echo "📦 Container: $EXISTING_CONTAINER"
    
    # Verificar se o banco postgres existe
    if docker exec $EXISTING_CONTAINER psql -U docker -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ Banco 'postgres' está acessível!"
    else
        echo "⚠️  Banco 'postgres' não está acessível. Tentando criar..."
        docker exec $EXISTING_CONTAINER psql -U docker -d cardapio -c "CREATE DATABASE postgres;" 2>/dev/null || echo "✅ Banco 'postgres' já existe!"
    fi
    
    echo "📊 Informações de conexão:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   User: docker"
    echo "   Password: docker"
    echo "   Database: postgres"
    
else
    echo "📦 Iniciando novo PostgreSQL..."
    
    # Parar containers existentes
    echo "🛑 Parando containers existentes..."
    docker-compose down
    
    # Iniciar o PostgreSQL
    echo "🐘 Iniciando PostgreSQL..."
    docker-compose up -d postgres
    
    # Aguardar o PostgreSQL estar pronto
    echo "⏳ Aguardando PostgreSQL estar pronto..."
    sleep 10
    
    # Verificar se o container está rodando
    if docker ps | grep -q "ste-crud-postgres"; then
        echo "✅ PostgreSQL está rodando!"
        echo "📊 Informações de conexão:"
        echo "   Host: localhost"
        echo "   Port: 5432"
        echo "   User: docker"
        echo "   Password: docker"
        echo "   Database: postgres"
    else
        echo "❌ Erro: PostgreSQL não está rodando!"
        exit 1
    fi
fi

echo "🎉 Configuração concluída! Você pode agora rodar sua aplicação." 