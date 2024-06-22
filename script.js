document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('itemName');
    const bodyInput = document.getElementById('description');
    const rateInput = document.getElementById('rate');
    const createBtn = document.getElementById('createBtn');
    const updateBtn = document.getElementById('updateBtn');

    const fetchPosts = async () => {
        const res = await fetch('http://localhost:8095/api/fetchAllItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        });
        const data = await res.json();
        const items = data.responseMessage;
        displayPost(items);
    };

    const displayPost = (posts) => {
        posts.forEach(post => {
            const tableBody = document.getElementById('postList');
            tableBody.innerHTML = '';
            let i = 1;
            posts.forEach(post => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                        <td>${i++}</td>
                        <td>${post.itemName}</td>
                        <td>${post.rate}</td>
                        <td>${post.description}</td>
                        <td>
                            <button class="deleteBtn" data-id="${post.id}">Delete</button>
                            <button class="editBtn" data-id="${post.id}">Edit</button>
                        </td>
                    `;
                tableBody.appendChild(tr);

                tr.querySelector('.deleteBtn').addEventListener('click', deletePost);
                tr.querySelector('.editBtn').addEventListener('click', () => editPost(post));
            });
        });
    };

    createBtn.addEventListener('click', async () => {
        const itemName = titleInput.value;
        const description = bodyInput.value;
        const rate = rateInput.value;

        if (itemName && description && rate) {
            const res = await fetch('http://localhost:8095/api/addItem', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({ itemName, rate, description }),
            });
            titleInput.value = '';
            bodyInput.value = '';
            rateInput.value = '';
            fetchPosts();
        }
    });

    const deletePost = async (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this item?')) {
            await fetch(`http://localhost:8095/api/deleteItem/${id}`, {
                method: 'DELETE',
            });
            fetchPosts();
        }
    };

    const editPost = (post) => {
        titleInput.value = post.itemName;
        bodyInput.value = post.description;
        rateInput.value = post.rate;
        updateBtn.style.display = 'inline-block';
        createBtn.style.display = 'none';
        updateBtn.addEventListener('click', async () => {
            await updatePost(post.id, post.itemName);
        })
    };

    const updatePost = async (id, item) => {
        const itemName = titleInput.value;
        const description = bodyInput.value;
        const rate = rateInput.value;
        console.log("itemName : ", itemName);
        console.log("item : ", item);
        if (itemName && description && rate) {
            const res = await fetch(`http://localhost:8095/api/updateItem/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({ itemName, description, rate, oldItemName: item }),
            });
            fetchPosts();
            titleInput.value = '';
            bodyInput.value = '';
            rateInput.value = '';
        }
    }

    fetchPosts();
});
