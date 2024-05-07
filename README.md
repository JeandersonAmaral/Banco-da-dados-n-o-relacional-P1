[![N|Solid](https://universidadedevassouras.edu.br/wp-content/uploads/2022/03/campus_marica.png)](https://universidadedevassouras.edu.br/campus-marica/)
# Curso de Engenharia de Software 
[![N|Solid](https://universidadedevassouras.edu.br/wp-content/uploads/2021/12/Simbolo_Engenharia_de_Software.jpg)](https://universidadedevassouras.edu.br/graduacao-marica/engenharia-de-software/)

### Aluno:

  - [Jeanderson Amaral](https://github.com/JeandersonAmaral)

### Disciplina:
  - Banco de dados não relacional

### Professor:
  - Fabrício Dias

# Enunciado
1. Criar um projeto utilizando mongodb, express e o padrão de projeto repository pattern, para o login de usuarios(usuarios podem ser cadastrados via requisição post, utilizado um postman ou insomnia). Deverá manter ainda o padrão MVC, utilizado em sala de aula e no trabalho anterior, só deverá dicionar o repository pattern.
2. Criar uma aplicação flask, que realize um CRUD dentro da aplicação(pode utilizar qualquer banco de dados relacional neste ponto).
3. Unir as duas camadas da aplicação, o login + o crud, nodejs + python.
4 . Documentar em forma de resumo o processo ao qual vocês utilizaram para chegar no final da aplicação.
5. Colocar no GITHUB.
6. Enviar um vídeo com o projeto funcionando.(Somente a tela). Pode hospedar no youtube.

# Regras de avaliação

Código não deverá de forma alguma ser igual ao do colega de classe (SUJEITO A ZERAR A AVALIAÇÃO).

Todas as avaliações serão sujeitas a análise do professor em sala de aula, para a devida nota, com perguntas pertinentes sobre o código criado pelo aluno, para que de fato, o aluno tenha pleno entendimento do que ele realizou.

# Resumo da aplicação:

1. **Backend Python com Flask e MySQL:**
   - O projeto utiliza o framework Flask para desenvolvimento web em Python.
   - Há uma conexão com um banco de dados MySQL para armazenamento de dados.
   - Rotas foram definidas para manipular requisições HTTP e renderizar templates HTML.
   - As rotas interagem com o banco de dados para executar operações como inserção, consulta, atualização e exclusão de registros.
   - Utiliza-se também a biblioteca `mysql.connector` para comunicação com o MySQL.

2. **Frontend com HTML, CSS e JavaScript:**
   - Os arquivos HTML são utilizados para renderizar as páginas web.
   - O CSS é usado para estilizar as páginas e elementos HTML.
   - O JavaScript é utilizado para manipulação do DOM e interações com o usuário.
   - Há um formulário de login implementado em JavaScript para autenticação de usuários.

3. **Backend Node.js com Express e MongoDB:**
   - O projeto utiliza o framework Express.js para desenvolvimento web em Node.js.
   - Utiliza-se o MongoDB como banco de dados NoSQL, com a biblioteca mongoose para modelagem e interação com os dados.
   - Foram definidas rotas para manipular operações CRUD (Create, Read, Update, Delete) para usuários.

4. **Configuração do Ambiente:**
   - São utilizadas variáveis de ambiente para configurar informações sensíveis, como as credenciais do banco de dados e a chave secreta da aplicação.
   - O arquivo `.env` é usado para armazenar essas variáveis de ambiente.
   - A biblioteca `dotenv` é utilizada para carregar as variáveis de ambiente a partir do arquivo `.env`.

5. **Outros Recursos:**
   - Utilização do `nodemon` para reiniciar automaticamente o servidor sempre que um arquivo é alterado no ambiente de desenvolvimento.
   - Utilização do pacote `opn` para abrir automaticamente o navegador com a URL do servidor após o início da execução.

# Vídeo do sistema em funcionamento:
https://github.com/JeandersonAmaral/Banco-da-dados-n-o-relacional-P1/assets/112119010/ee52401e-6d8d-4656-865c-2ecbdf587a46


## Arquivos principais | JavaScript
### server.js
```javascript
const express = require("express");
const cors = require("cors");
const path = require("path");
const opn = require("opn");
const app = express();
const userRoutes = require("./routes/userRoutes");
require("dotenv").config({ path: './.env'});
const ConnectMongoDB = require('./config/database');

ConnectMongoDB();

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use(express.static(path.join(__dirname, './public')));
app.get("/", (req, res) => {
    const loginPagePath = path.join(__dirname, "./views/login.html");
    res.sendFile(loginPagePath);
});

const server = app.listen(process.env.PORT || 3000, () => {
    const { address, port } = server.address();
    const hostname = address === "::" ? "localhost" : address;
    const url = `http://${hostname}:${port}/`; 
    console.log("\x1b[34mConexão com MongoDB estabelecida com sucesso!\x1b[0m");
    setTimeout(() => {
        console.log("\x1b[34mServidor rodando no endereço local: \x1b[31m", url);
        setTimeout(() => {
            console.log("\x1b[34mRedirecionando...\x1b[0m");
            setTimeout(() => {
                opn(url);
            }, 2000);
        }, 2000);
    }, 2000);
});
   ```

### userControllers.js
```javascript
const User = require('../models/User');

const userController = {};

userController.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

userController.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

userController.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

userController.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

userController.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

userController.login = async (req, res) => {
    const { nome, senha } = req.body;

    try {
        const user = await User.findOne({ nome, senha });

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        res.status(200).json({ message: "Login bem-sucedido", user });
    } catch (error) {
        console.error("Erro durante a autenticação:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

module.exports = userController;

```

## Arquivos principais | Pyhton
### app.py
```python
import mysql.connector
from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
from settings import config, SECRET_KEY

app = Flask(__name__)
app.config.from_object('settings')
app.secret_key = SECRET_KEY 
app.env = 'production'


def get_db_connection():
    connection = mysql.connector.connect(**config)
    return connection


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/testdb')
def testdb():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(tables=tables), 200
    except mysql.connector.Error as err:
        app.logger.error(f"Erro ao conectar ao banco de dados: {err}")
        return jsonify(message="Erro ao conectar ao banco de dados.", error=str(err)), 500


def create_database_if_not_exists():
    host = 'localhost'
    user = 'root'
    password = '12345678'
    connection = mysql.connector.connect(host=host, user=user, password=password)
    cursor = connection.cursor()
    database_name = 'aula_13_10'
    cursor.execute(f"SHOW DATABASES LIKE '{database_name}'")
    result = cursor.fetchone()
    if result is None:
        cursor.execute(f"CREATE DATABASE {database_name}")
        print(f"Banco de dados `{database_name}` criado com sucesso!")
    else:
        print(f"Banco de dados `{database_name}` já existe.")
    cursor.close()
    connection.close()


def get_db_connection():
    create_database_if_not_exists()
    host = 'localhost'
    database = 'mysql'
    user = 'root'
    password = '12345678'
    connection = mysql.connector.connect(
        host=host,
        database=database,
        user=user,
        password=password
    )
    return connection


@app.route('/novo_setor')
def novo_setor():
    return render_template('setor_form.html')


@app.route('/novo_funcionario')
def novo_funcionario():
    setores = []
    connection = get_db_connection()
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT id, nome FROM setor")
        setores = cursor.fetchall()
        
    except mysql.connector.Error as err:
        print("Erro ao ler os dados do setor: ", err)
    finally:
        cursor.close()
        connection.close()
    return render_template('funcionario_form.html', setores=setores)


@app.route('/criar_funcionario', methods=['POST'])
def criar_funcionario():
    primeiro_nome = request.form['primeiro_nome']
    sobrenome = request.form['sobrenome']
    data_admissao = request.form['data_admissao']
    status_funcionario = 'status_funcionario' in request.form
    id_setor = request.form['id_setor']
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
        INSERT INTO funcionarios (primeiro_nome, sobrenome, data_admissao, status_funcionario, id_setor) 
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (primeiro_nome, sobrenome, data_admissao, status_funcionario, id_setor))
        connection.commit()
        flash('Funcionário criado com sucesso!', 'success')
    except mysql.connector.Error as err:
        flash(f'Erro ao criar o funcionário: {err}', 'error')
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
    return redirect(url_for('listar_funcionarios'))



@app.route('/funcionario_criado')
def funcionario_criado():
    return "Funcionário criado com sucesso!"


@app.route('/criar_setor', methods=['POST'])
def criar_setor():
    nome_setor = request.form['nome']

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "INSERT INTO setor (nome) VALUES (%s)"
        cursor.execute(query, (nome_setor,))
        connection.commit() 
        flash('Setor criado com sucesso!', 'success')  
    except mysql.connector.Error as err:
        flash(f'Erro ao criar o setor: {err}', 'error')
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    return redirect(url_for('listar_setores'))


@app.route('/setor_criado')
def setor_criado():
    return "Setor criado com sucesso!"


@app.route('/novo_cargo')
def novo_cargo():
    setores = []
    connection = get_db_connection()
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT id, nome FROM setor")
        setores = cursor.fetchall()
    except mysql.connector.Error as err:
        print("Erro ao ler os dados do setor: ", err)
    finally:
        cursor.close()
        connection.close()

    return render_template('cargo_form.html', setores=setores)


@app.route('/criar_cargo', methods=['POST'])
def criar_cargo():
    nome = request.form['nome']
    id_setor = request.form['id_setor']

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("INSERT INTO cargos (nome, id_setor) VALUES (%s, %s)", (nome, id_setor))
        connection.commit()
        flash('Cargo criado com sucesso!', 'success')
    except mysql.connector.Error as err:
        flash(f'Erro ao criar o cargo: {err}', 'error')
    finally:
        cursor.close()
        connection.close()
    return redirect(url_for('listar_cargos'))


@app.route('/cargo_criado')
def cargo_criado():
    return "Cargo criado com sucesso!"


@app.route('/listar_setores')
def listar_setores():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT id, nome FROM setor")
    setores = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('listar_setores.html', setores=setores)


@app.route('/listar_funcionarios')
def listar_funcionarios():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT id, primeiro_nome, sobrenome FROM funcionarios")
    funcionarios = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('listar_funcionarios.html', funcionarios=funcionarios)


@app.route('/listar_cargos')
def listar_cargos():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT id, nome FROM cargos")
    cargos = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('listar_cargos.html', cargos=cargos)


def create_tables_if_not_exists():
    connection = get_db_connection()
    cursor = connection.cursor()
    create_table_setor = """
    CREATE TABLE IF NOT EXISTS setor (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(50) NOT NULL
    );
    """
    create_table_funcionarios = """
    CREATE TABLE IF NOT EXISTS funcionarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        primeiro_nome VARCHAR(50) NOT NULL,
        sobrenome VARCHAR(50) NOT NULL,
        data_admissao DATE NOT NULL,
        status_funcionario BOOL NOT NULL,
        id_setor INT,
        FOREIGN KEY (id_setor) REFERENCES setor(id)
    );
    """
    create_table_cargos = """
    CREATE TABLE IF NOT EXISTS cargos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(50),
        id_setor INT,
        FOREIGN KEY (id_setor) REFERENCES setor(id)
    );
    """

    cursor.execute(create_table_setor)
    cursor.execute(create_table_funcionarios)
    cursor.execute(create_table_cargos)

    cursor.close()
    connection.commit()
    connection.close()

create_tables_if_not_exists()


if __name__ == '__main__':
    app.run()

```
### settings.py
```python
from flask import Flask
import os
import mysql.connector


config = {
    'user': 'root',
    'password': '12345678',
    'host': 'localhost',
    'database': 'mysql',
    'raise_on_warnings': True
}

app = Flask(__name__)
SECRET_KEY = os.environ.get('SECRET_KEY', '202e7fa41c6dca5b43a88ff0fd7b353b')


def get_db_connection():
    connection = mysql.connector.connect(**config)
    return connection

```
