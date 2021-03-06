$(function () {
  if ($('#tabelaClientes [data-id]').length) {
    $('#tabelaClientes').DataTable();
  }

  /**
   * Itens pesquisados na query string
   */
  var searchParams = new URLSearchParams(window.location.search);

  // Foca o usuário no input de pesquisa ao iniciar a tela
  $('#query-input').focus();

  // Clica no botão de busca ao apertar a tecla Enter no campo de busca
  $('#query-input').keypress(function (e) {
    if (e.key === 'Enter') {
      $('#btn-search').click();
    }
  });

  // Filtra os resultado da tabela ao clicar no botão de busca
  $('#btn-search').click(function () {
    var query = $('#query-input').val();
    if (query) {
      window.location.assign('/customer?q=' + query);
    } else if (searchParams.get('q')) {
      window.location.assign('/customer');
    }
  });

  // Cadastra o usuário ao clicar no botão de cadastrar
  $('#btn-create').click(function () {
    const customer = {
      fullName: $('#nameFormInput').val(),
      nickname: $('#nicknameFormInput').val(),
      phone: $('#phoneFormInput').val(),
      email: $('#emailFormInput').val(),
      address: $('#addressFormInput').val(),
    };

    const id = $('#idFormInput').val();

    if (id) {
      editCustomer(id, customer);
    } else {
      createCustomer(customer);
    }
  });

  // Muda o texto do modal para cadastrar e abre o modal ao clicar no botão de adicionar
  $('.btn-create').click(function () {
    $('#modal-create-customer').find('h2').text('Cadastrar cliente');
    $('#modal-create-customer').modal('show');
  });

  // Abre o modal de editar ao clicar no botão de editar na lista
  $('.edit-action').click(function () {
    const id = $(this).data('id');

    $('#modal-create-customer').find('h2').text('Editar cliente');

    $.get('/customer/' + id)
      .then((customer) => setModalInputs(customer))
      .catch((err) => noty('Ocorreu um erro ao buscar os dados do usuário.', 'error'));
  });

  // Remove o usuário ao clicar no botão de remover na lista
  $('.remove-action').click(function () {
    confirmDialog('Deseja realmente remover este cliente?', () => {
      const id = $(this).data('id');
      deleteCustomer(id);
    });
  });

  // Limpa os campos ao fechar o modal de cadastro
  $('#modal-create-customer').on('hide.bs.modal', function () {
    $(this).find('input').val('');
  });
});

/**
 * Cria um cliente a partir de um objeto
 * @param {object} customer Informações do usuário
 */
function createCustomer(customer) {
  noty('Cadastrando cliente');
  $.post('/customer', customer)
    .then(function () {
      noty('Cliente cadastrado com sucesso!', 'success', () => window.location.reload());
    })
    .fail(function () {
      noty('Ocorreu um erro, verifique as informações e tente novamente.', 'error');
    });
}

/**
 * Edita um usuário a partir de um objeto com as alterações
 * @param {number} id Id do cliente
 * @param {any} customer Informações do cliente para editar
 */
function editCustomer(id, customer) {
  $.ajax({
    url: '/customer/' + id,
    method: 'PUT',
    data: JSON.stringify(customer),
    contentType: 'application/json'
  })
    .then(function () {
      noty('Cliente atualizado com sucesso!', 'success', () => window.location.reload());
    })
    .fail(function () {
      noty('Ocorreu um erro, verifique as informações e tente novamente.', 'error');
    });
}

/**
 * Remove o cliente a partir de um id
 * @param {number} id Id do cliente
 */
function deleteCustomer(id) {
  $.ajax({
    url: '/customer/' + id,
    method: 'DELETE'
  })
    .then(() => {
      noty('Cliente removido com sucesso!', 'success', () => window.location.reload());
    })
    .catch(() => noty('Ocorreu um erro ao tentar remover o cliente.', 'error'));
}

/**
 * Atualiza os inputs do modal com os dados do cliente
 * @param {object} customer Dados do cliente
 */
function setModalInputs(customer) {
  $('#idFormInput').val(customer.id);
  $('#nicknameFormInput').val(customer.nickname);
  $('#nameFormInput').val(customer.fullName);
  $('#emailFormInput').val(customer.email);
  $('#phoneFormInput').val(customer.phone);
  $('#addressFormInput').val(customer.address);

  $('#modal-create-customer').modal('show');
}
