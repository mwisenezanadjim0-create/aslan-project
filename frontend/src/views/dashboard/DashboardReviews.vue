<template>
  <div class="dashboard-reviews">
    <div class="header-section reveal">
      <h2>Guest Reviews</h2>
      <p>Hear what your first and latest customers are saying.</p>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading reviews...</p>
    </div>

    <div v-else-if="reviews.length === 0" class="empty-state">
      <div class="empty-icon">💬</div>
      <h3>No reviews yet</h3>
      <p>Reviews from the first 3 customers will appear here once they post them.</p>
    </div>

    <div v-else class="reviews-list">
      <div v-for="review in reviews" :key="review._id" class="review-card glass-container reveal">
        <div class="review-header">
          <div class="customer-info">
            <span class="customer-name">{{ review.name }}</span>
            <span class="review-date">{{ formatDate(review.createdAt) }}</span>
          </div>
          <div class="stars">
            <i v-for="i in 5" :key="i" class="fa-star" :class="i <= review.rating ? 'fas active' : 'far'"></i>
          </div>
        </div>
        <p class="review-text">"{{ review.text }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const reviews = ref([])
const loading = ref(true)

const fetchReviews = async () => {
  try {
    const { data } = await axios.get('/api/reviews')
    reviews.value = data
  } catch (err) {
    console.error("Failed to fetch reviews", err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchReviews()
})
</script>

<style scoped>
.dashboard-reviews {
  padding: 20px;
}

.header-section {
  margin-bottom: 40px;
}

.header-section h2 {
  font-size: 2.2rem;
  color: var(--primary);
  margin-bottom: 5px;
}

.reviews-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 25px;
}

.review-card {
  padding: 30px;
  position: relative;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}

.review-date {
  font-size: 0.85rem;
  color: var(--text-dim);
}

.stars {
  display: flex;
  gap: 4px;
  color: #ffae00;
}

.review-text {
  font-size: 1.05rem;
  font-style: italic;
  line-height: 1.6;
  color: #eee;
}

.loading-state, .empty-state {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  opacity: 0.2;
  margin-bottom: 20px;
}

@media (max-width: 600px) {
  .reviews-list { grid-template-columns: 1fr; }
}
</style>
