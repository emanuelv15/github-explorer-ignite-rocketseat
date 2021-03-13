import { useState, useEffect } from 'react';

import { RepositoryItem } from "./RepositoryItem"

import '../styles/repositories.scss'

interface Repository {
    name: string;
    description: string;
    html_url: string;
    owner: {
        login: string;
    };
}

export function RepositoryList() {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [searchOne, setSearchOne] = useState("orgs");
    const [searchTwo, setSearchTwo] = useState("");
    const [page, setPage] = useState(1);
    const [showNextButton, setShowNextButton] = useState(false);
    const [showPreviousButton, setShowPreviousButton] = useState(false);

    useEffect( () => {
        if (searchTwo != "") {
            fetch(`https://api.github.com/${searchOne}/${searchTwo}/repos?page=${page}`)
                .then(response => response.status != 404 ? response.json() : alert("Usuario/organizacao nao encontrado."))
                .then(data => data ? setRepositories(data) : setRepositories([]));
            checkNextPage();
            checkPreviousPage();
            window.scrollTo(0, 0);
        }
    }, [page, searchOne, searchTwo])

    function nextPage() {
        setPage(page + 1);
    }

    function previousPage() {
        setPage(page - 1);
    }

    function checkNextPage(){
        fetch(`https://api.github.com/${searchOne}/${searchTwo}/repos?page=${page+1}`)
            .then(response => response.json())
            .then(data => {data.length > 0 ? setShowNextButton(true) : setShowNextButton(false)})
    }

    function checkPreviousPage(){
        if (page > 1) {
            fetch(`https://api.github.com/${searchOne}/${searchTwo}/repos?page=${page-1}`)
            .then(response => response.json())
            .then(data => {data.length > 0 ? setShowPreviousButton(true) : setShowPreviousButton(false)})
        } else {
            setShowPreviousButton(false)
        }
    }

    function slctSearchOne() {
        setSearchOne((document.getElementById("slctSearchOne"))!.value);
        setPage(1);
    }

    function inputSearchTwo() {
        setSearchTwo((document.getElementById("txtSearchTwo"))!.value);
        setPage(1);
    }

    return (
        <section className="repository-list">
            <select id="slctSearchOne" onClick={slctSearchOne}>
                <option value="orgs">Organizacao</option>
                <option value="users">Usuario</option>
            </select> 

            <input type="text" id="txtSearchTwo" placeholder="Buscar..." onKeyPress={() => {
                document.getElementById("txtSearchTwo")!.onkeypress = function(e) {
                    if (e.keyCode == 13) {
                        inputSearchTwo();
                    }
                }
            }}/>

            <h1>{`Lista de Repositorios${repositories[0] ? ` ${repositories[0].owner.login}` : "" }`}</h1>
            
            <ul>
                {repositories.map(repository => <RepositoryItem key={repository.name} repository={repository}/>)}
                
                
            </ul>

            {showPreviousButton ? <button type="button" onClick={previousPage}>Pagina anterior</button> : null}
                {showNextButton ? <button type="button" onClick={nextPage}>Proxima pagina</button> : null}
        </section>
    );
}