#!/bin/bash
echo "Configurando banco de dados MySQL..."
echo ""
echo "Executando script SQL..."
mysql -u root -p1234 < database/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Banco de dados criado com sucesso!"
else
    echo "❌ Erro ao criar banco de dados."
    echo "Certifique-se de que o MySQL está rodando e a senha está correta."
fi

