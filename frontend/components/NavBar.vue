<script lang="ts" setup>
import type { NuxtLink } from '#build/components';

  const isLoggedIn = ref(false);
</script>

<template>
  <header class="header_section">
    <div class="container-fluid">
      <nav class="navbar navbar-expand-lg custom_nav-container ">
        <NuxtLink class="navbar-brand" :to="`/`">
          <span>
            Bostorek
          </span>
        </NuxtLink>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class=""> </span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <NuxtLink class="nav-link pl-lg-0" :to="`/`">Home <span class="sr-only">(current)</span></NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" :to="`/books`">Books</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" :to="`/dashboard`">Dashboard</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" :to="`/login`">Login</NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink class="nav-link" :to="`/register`">Register</NuxtLink>
            </li>
            <li v-if="isLoggedIn" class="nav-item">
              <button class="nav-link">Logout</button>
            </li>
          </ul>
          <form class="search_form">
            <input type="text" class="form-control" placeholder="Search here...">
            <button class="" type="submit">
              <i class="fa fa-search" aria-hidden="true"></i>
            </button>
          </form>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.custom-nav {
  background-color: var(--primary-color);
  padding: 15px 0;
}

.navbar-brand {
  padding: 0;
  margin: 0;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.nav-link {
  padding: 10px 15px !important;
  color: #fff;
  text-align: center;
}

.nav-link:hover {
  color: var(--secondary-color);
}

.active-link {
  color: var(--secondary-color);
}
</style>