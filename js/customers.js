const customers=[

    {
    
    name:"Ahmed",
    
    email:"ahmed@email.com",
    
    phone:"+213555000001",
    
    orders:12,
    
    spent:"68,000 DA"
    
    },
    
    {
    
    name:"Sara",
    
    email:"sara@email.com",
    
    phone:"+213555000002",
    
    orders:5,
    
    spent:"24,500 DA"
    
    },
    
    {
    
    name:"Mohamed",
    
    email:"mohamed@email.com",
    
    phone:"+213555000003",
    
    orders:9,
    
    spent:"51,000 DA"
    
    }
    
    ];
    
    const tbody=document.getElementById("customersTableBody");
    
    customers.forEach(customer=>{
    
    tbody.innerHTML+=`
    
    <tr>
    
    <td>
    
    <div class="avatar">
    
    ${customer.name.charAt(0)}
    
    </div>
    
    </td>
    
    <td>${customer.name}</td>
    
    <td>${customer.email}</td>
    
    <td>${customer.phone}</td>
    
    <td>${customer.orders}</td>
    
    <td>${customer.spent}</td>
    
    <td>
    
    <button>👁</button>
    
    <button>✉</button>
    
    </td>
    
    </tr>
    
    `;
    
    });